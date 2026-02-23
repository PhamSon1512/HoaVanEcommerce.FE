import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ShopSettingDto } from '../../core/services/order-api.service';
import { CartService, CartItem } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { OrderApiService } from '../../core/services/order-api.service';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterLink, FormsModule],
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss']
})
export class CartPageComponent implements OnInit {
  items: CartItem[] = [];
  selectedItems: Set<number> = new Set(); // Track selected cart item IDs
  isLoading = false;
  error: string | null = null;
  isLoggedIn = false;
  showPaymentModal = false;
  paymentOrder: any = null;
  shopSetting: any = null;

  constructor(
    private cart: CartService,
    private auth: AuthService,
    private orderApi: OrderApiService
  ) {}

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    this.auth.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });

    this.cart.cart$.subscribe(state => {
      this.items = state.items;
    });

    // Refresh cart from API if logged in
    if (this.auth.currentUserSnapshot) {
      this.cart.refresh();
    }
  }

  get totalAmount(): number {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  get totalQuantity(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  get isEmpty(): boolean {
    return this.items.length === 0;
  }

  updateQuantity(item: CartItem, newQuantity: number): void {
    const qty = Math.max(1, Math.floor(newQuantity));
    this.cart.updateQuantity(item.productId, qty);
  }

  removeItem(item: CartItem): void {
    if (confirm(`Bạn có chắc chắn muốn xóa "${item.name}" khỏi giỏ hàng?`)) {
      this.cart.removeItem(item.productId);
    }
  }

  clearCart(): void {
    if (confirm('Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?')) {
      this.cart.clear();
    }
  }

  toggleItemSelection(item: CartItem): void {
    if (!item.id) return;
    if (this.selectedItems.has(item.id)) {
      this.selectedItems.delete(item.id);
    } else {
      this.selectedItems.add(item.id);
    }
  }

  get selectableItemIds(): number[] {
    return this.items.filter(i => i.id != null).map(i => i.id as number);
  }

  get allSelectableSelected(): boolean {
    const ids = this.selectableItemIds;
    return ids.length > 0 && this.selectedItems.size === ids.length;
  }

  toggleSelectAll(): void {
    const ids = this.selectableItemIds;
    if (ids.length === 0) return;

    if (this.selectedItems.size === ids.length) {
      this.selectedItems.clear();
    } else {
      this.selectedItems = new Set(ids);
    }
  }

  get selectedTotalAmount(): number {
    return this.items
      .filter(item => item.id && this.selectedItems.has(item.id))
      .reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  get selectedTotalQuantity(): number {
    return this.items
      .filter(item => item.id && this.selectedItems.has(item.id))
      .reduce((sum, item) => sum + item.quantity, 0);
  }

  get hasSelectedItems(): boolean {
    return this.selectedItems.size > 0;
  }

  paymentPreviewItems: CartItem[] = [];
  paymentPreviewTotalAmount = 0;

  async checkout(): Promise<void> {
    if (!this.isLoggedIn) {
      alert('Vui lòng đăng nhập để thanh toán.');
      return;
    }

    if (this.selectedItems.size === 0) {
      alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán.');
      return;
    }

    this.isLoading = true;
    this.error = null;

    try {
      // Load shop setting for QR code
      this.shopSetting = await firstValueFrom(this.orderApi.getShopSetting());

      // Build preview (do NOT create order yet)
      this.paymentPreviewItems = this.items.filter(i => i.id != null && this.selectedItems.has(i.id));
      this.paymentPreviewTotalAmount = this.paymentPreviewItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

      this.showPaymentModal = true;
    } catch (err: any) {
      this.error = err?.error?.message || 'Có lỗi xảy ra khi tải thông tin thanh toán.';
      console.error('Checkout error:', err);
    } finally {
      this.isLoading = false;
    }
  }

  closePaymentModal(): void {
    this.showPaymentModal = false;
    this.paymentOrder = null;
    this.paymentPreviewItems = [];
    this.paymentPreviewTotalAmount = 0;
    this.error = null;
  }

  async confirmPayment(transactionRef?: string): Promise<void> {
    if (!this.isLoggedIn) {
      alert('Vui lòng đăng nhập để xác nhận thanh toán.');
      return;
    }

    if (this.selectedItems.size === 0) {
      alert('Không có sản phẩm nào được chọn để thanh toán.');
      return;
    }

    this.isLoading = true;
    this.error = null;

    try {
      // Create order ONLY when user confirms payment
      const order = await firstValueFrom(this.orderApi.createOrder({
        cartItemIds: Array.from(this.selectedItems)
      }));

      // Confirm payment -> move to PENDING_VERIFY
      await firstValueFrom(this.orderApi.confirmPayment(order.id, { transactionRef }));

      this.paymentOrder = order;
      alert('Đã ghi nhận thanh toán! Đơn hàng của bạn đang chờ admin xác minh.');

      // Clear selected items after successful order creation
      this.selectedItems.clear();
      this.cart.refresh();
      this.closePaymentModal();
    } catch (err: any) {
      this.error = err?.error?.message || 'Có lỗi xảy ra khi xác nhận thanh toán.';
      console.error('Confirm payment error:', err);
    } finally {
      this.isLoading = false;
    }
  }
}
