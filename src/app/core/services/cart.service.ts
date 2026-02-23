import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, of, switchMap, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { Product } from '../models/product.model';
import { CartApiService, CartDto, CartItemDto } from './cart-api.service';

export interface CartItem {
  id?: number;
  productId: number;
  name: string;
  code?: string;
  price: number;
  imageUrl: string;
  categoryName: string;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}

const CART_GUEST_KEY = 'hv_cart_guest_v1';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly cartSubject = new BehaviorSubject<CartState>({ items: [] });
  readonly cart$ = this.cartSubject.asObservable();

  constructor(
    private auth: AuthService,
    private cartApi: CartApiService
  ) {
    // Load initial cart
    this.loadCartForCurrentSession();

    // When login/logout changes, reload cart
    this.auth.currentUser$.subscribe(user => {
      if (user?.id != null) {
        this.loadCartFromApi();
      } else {
        this.loadGuestCart();
      }
    });
  }

  get snapshot(): CartState {
    return this.cartSubject.value;
  }

  get totalQuantity(): number {
    return this.snapshot.items.reduce((sum, i) => sum + i.quantity, 0);
  }

  addProduct(product: Product, quantity = 1): void {
    const user = this.auth.currentUserSnapshot;
    const token = localStorage.getItem('hv_auth_token_v1');
    
    if (user?.id != null && token) {
      // User logged in - use API
      this.cartApi.addToCart({ productId: product.id, quantity }).subscribe({
        next: (cart) => this.updateCartFromDto(cart),
        error: (err) => {
          // If 401, token might be invalid - fallback to guest cart
          if (err.status === 401) {
            console.warn('Add to cart returned 401 - token may be invalid. Using guest cart.');
            // Fall through to guest cart logic
            const q = Math.max(1, quantity);
            const existing = this.snapshot.items.find(i => i.productId === product.id);
            const nextItems = existing
              ? this.snapshot.items.map(i =>
                  i.productId === product.id ? { ...i, quantity: i.quantity + q } : i
                )
              : [
                  ...this.snapshot.items,
                  {
                    productId: product.id,
                    name: product.name,
                    code: product.code,
                    price: product.price,
                    imageUrl: product.imageUrl,
                    categoryName: product.categoryName,
                    quantity: q
                  }
                ];
            this.setGuestCart({ items: nextItems });
          } else {
            console.error('Failed to add to cart:', err);
          }
        }
      });
    } else {
      // Guest - use localStorage
      const q = Math.max(1, quantity);
      const existing = this.snapshot.items.find(i => i.productId === product.id);
      const nextItems = existing
        ? this.snapshot.items.map(i =>
            i.productId === product.id ? { ...i, quantity: i.quantity + q } : i
          )
        : [
            ...this.snapshot.items,
            {
              productId: product.id,
              name: product.name,
              code: product.code,
              price: product.price,
              imageUrl: product.imageUrl,
              categoryName: product.categoryName,
              quantity: q
            }
          ];
      this.setGuestCart({ items: nextItems });
    }
  }

  updateQuantity(productId: number, quantity: number): void {
    const user = this.auth.currentUserSnapshot;
    const item = this.snapshot.items.find(i => i.productId === productId);
    
    if (!item) return;

    if (user?.id != null && item.id != null) {
      // User logged in - use API
      this.cartApi.updateCartItem(item.id, { quantity }).subscribe({
        next: (cart) => this.updateCartFromDto(cart),
        error: (err) => console.error('Failed to update cart item:', err)
      });
    } else {
      // Guest - use localStorage
      const q = Math.max(0, Math.floor(quantity));
      const nextItems = q === 0
        ? this.snapshot.items.filter(i => i.productId !== productId)
        : this.snapshot.items.map(i => (i.productId === productId ? { ...i, quantity: q } : i));
      this.setGuestCart({ items: nextItems });
    }
  }

  removeItem(productId: number): void {
    const user = this.auth.currentUserSnapshot;
    const item = this.snapshot.items.find(i => i.productId === productId);
    
    if (!item) return;

    if (user?.id != null && item.id != null) {
      // User logged in - use API
      this.cartApi.removeCartItem(item.id).subscribe({
        next: (cart) => this.updateCartFromDto(cart),
        error: (err) => console.error('Failed to remove cart item:', err)
      });
    } else {
      // Guest - use localStorage
      this.setGuestCart({ items: this.snapshot.items.filter(i => i.productId !== productId) });
    }
  }

  clear(): void {
    const user = this.auth.currentUserSnapshot;
    if (user?.id != null) {
      // User logged in - use API
      this.cartApi.clearCart().subscribe({
        next: () => this.cartSubject.next({ items: [] }),
        error: (err) => console.error('Failed to clear cart:', err)
      });
    } else {
      // Guest - use localStorage
      this.setGuestCart({ items: [] });
    }
  }

  refresh(): void {
    const user = this.auth.currentUserSnapshot;
    if (user?.id != null) {
      this.loadCartFromApi();
    } else {
      this.loadGuestCart();
    }
  }

  private loadCartForCurrentSession(): void {
    const user = this.auth.currentUserSnapshot;
    if (user?.id != null) {
      this.loadCartFromApi();
    } else {
      this.loadGuestCart();
    }
  }

  private loadCartFromApi(): void {
    // Double-check token exists before calling API
    const token = localStorage.getItem('hv_auth_token_v1');
    if (!token) {
      // No token, fallback to guest cart
      this.loadGuestCart();
      return;
    }

    this.cartApi.getCart().subscribe({
      next: (cart) => this.updateCartFromDto(cart),
      error: (err) => {
        // If 401, token might be invalid - clear it and use guest cart
        if (err.status === 401) {
          console.warn('Cart API returned 401 - token may be invalid. Using guest cart.');
          this.loadGuestCart();
        } else {
          console.error('Failed to load cart:', err);
          this.cartSubject.next({ items: [] });
        }
      }
    });
  }

  private loadGuestCart(): void {
    const state = this.readGuestCart();
    this.cartSubject.next(state);
  }

  private updateCartFromDto(dto: CartDto): void {
    const items: CartItem[] = dto.items.map(i => ({
      id: i.id,
      productId: i.productId,
      name: i.productName,
      code: i.productCode,
      price: i.unitPrice,
      imageUrl: i.productImageUrl,
      categoryName: i.categoryName,
      quantity: i.quantity
    }));
    this.cartSubject.next({ items });
  }

  private setGuestCart(state: CartState): void {
    this.cartSubject.next(state);
    this.writeGuestCart(state);
  }

  private readGuestCart(): CartState {
    try {
      const raw = localStorage.getItem(CART_GUEST_KEY);
      if (!raw) return { items: [] };
      const parsed = JSON.parse(raw) as CartState;
      return { items: Array.isArray(parsed.items) ? parsed.items : [] };
    } catch {
      return { items: [] };
    }
  }

  private writeGuestCart(state: CartState): void {
    localStorage.setItem(CART_GUEST_KEY, JSON.stringify(state));
  }
}
