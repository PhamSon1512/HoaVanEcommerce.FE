import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CartItemDto {
  id: number;
  productId: number;
  productName: string;
  productCode?: string;
  productImageUrl: string;
  categoryName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface CartDto {
  id: number;
  userId?: number;
  status: string;
  items: CartItemDto[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartApiService {
  private readonly baseUrl = '/api/cart';

  constructor(private http: HttpClient) { }

  getCart(): Observable<CartDto> {
    return this.http.get<CartDto>(this.baseUrl);
  }

  addToCart(request: AddToCartRequest): Observable<CartDto> {
    return this.http.post<CartDto>(`${this.baseUrl}/items`, request);
  }

  updateCartItem(cartItemId: number, request: UpdateCartItemRequest): Observable<CartDto> {
    return this.http.put<CartDto>(`${this.baseUrl}/items/${cartItemId}`, request);
  }

  removeCartItem(cartItemId: number): Observable<CartDto> {
    return this.http.delete<CartDto>(`${this.baseUrl}/items/${cartItemId}`);
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/clear`);
  }
}
