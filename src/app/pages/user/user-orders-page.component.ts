import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { OrderApiService, OrderDto, ConfirmReceivedRequest } from '../../core/services/order-api.service';

@Component({
  selector: 'app-user-orders-page',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, FormsModule, RouterLink],
  templateUrl: './user-orders-page.component.html',
  styleUrls: ['./user-orders-page.component.scss']
})
export class UserOrdersPageComponent implements OnInit {
  orders: OrderDto[] = [];
  selectedOrder: OrderDto | null = null;
  showDetailModal = false;
  showConfirmModal = false;
  showReportModal = false;
  isLoading = false;
  error: string | null = null;
  confirmNote = '';
  reportContent = '';

  constructor(private orderApi: OrderApiService) {}

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.error = null;
    this.orderApi.getMyOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Có lỗi xảy ra khi tải danh sách đơn hàng.';
        this.isLoading = false;
        console.error('Load orders error:', err);
      }
    });
  }

  viewOrderDetail(order: OrderDto): void {
    this.selectedOrder = order;
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedOrder = null;
  }

  openConfirmReceivedModal(order: OrderDto): void {
    if (order.shippingStatus !== 'SHIPPED' && order.shippingStatus !== 'DELIVERING') {
      alert('Chỉ có thể xác nhận đã nhận hàng khi đơn hàng đã được vận chuyển.');
      return;
    }
    this.selectedOrder = order;
    this.confirmNote = '';
    this.showConfirmModal = true;
  }

  closeConfirmModal(): void {
    this.showConfirmModal = false;
    this.selectedOrder = null;
    this.confirmNote = '';
  }

  openReportModal(order: OrderDto): void {
    if (!this.canReportOrder(order)) {
      alert('Chỉ có thể báo cáo các đơn hàng đã được vận chuyển.');
      return;
    }
    this.selectedOrder = order;
    this.reportContent = '';
    this.showReportModal = true;
  }

  closeReportModal(): void {
    this.showReportModal = false;
    this.selectedOrder = null;
    this.reportContent = '';
  }

  confirmReceived(): void {
    if (!this.selectedOrder) return;

    this.isLoading = true;
    const request: ConfirmReceivedRequest = {
      note: this.confirmNote || undefined
    };

    this.orderApi.confirmReceived(this.selectedOrder.id, request).subscribe({
      next: () => {
        this.loadOrders();
        this.closeConfirmModal();
        alert('Xác nhận đã nhận hàng thành công!');
      },
      error: (err) => {
        this.error = err?.error?.message || 'Có lỗi xảy ra khi xác nhận đã nhận hàng.';
        this.isLoading = false;
        console.error('Confirm received error:', err);
      }
    });
  }

  getStatusLabel(status: string, type: 'order' | 'payment' | 'shipping'): string {
    const statusMap: Record<string, string> = {
      'PENDING_PAYMENT': 'Chờ thanh toán',
      'PAYMENT_PENDING_VERIFY': 'Chờ xác minh thanh toán',
      'PAYMENT_VERIFIED': 'Đã xác minh thanh toán',
      'PREPARING': 'Đang chuẩn bị hàng',
      'SHIPPED': 'Đã vận chuyển',
      'DELIVERING': 'Đang giao hàng',
      'COMPLETED': 'Hoàn thành',
      'CANCELLED': 'Đã hủy',
      'PENDING': 'Chờ thanh toán',
      'PENDING_VERIFY': 'Chờ xác minh',
      'VERIFIED': 'Đã xác minh',
      'FAILED': 'Thất bại',
      'NOT_SHIPPED': 'Chưa vận chuyển',
      'DELIVERED': 'Đã giao hàng'
    };
    return statusMap[status] || status;
  }

  getStatusClass(status: string, type: 'order' | 'payment' | 'shipping'): string {
    if (type === 'payment') {
      if (status === 'VERIFIED') return 'status-badge--success';
      if (status === 'PENDING_VERIFY') return 'status-badge--warning';
      if (status === 'FAILED') return 'status-badge--danger';
      return 'status-badge--info';
    }
    if (type === 'shipping') {
      if (status === 'DELIVERED') return 'status-badge--success';
      if (status === 'SHIPPED' || status === 'DELIVERING') return 'status-badge--warning';
      return 'status-badge--info';
    }
    if (status === 'COMPLETED') return 'status-badge--success';
    if (status === 'CANCELLED') return 'status-badge--danger';
    if (status === 'PREPARING' || status === 'SHIPPED' || status === 'DELIVERING') return 'status-badge--warning';
    return 'status-badge--info';
  }

  canConfirmReceived(order: OrderDto): boolean {
    return order.shippingStatus === 'SHIPPED' || order.shippingStatus === 'DELIVERING';
  }

  canReportOrder(order: OrderDto): boolean {
    return order.shippingStatus === 'SHIPPED'
      || order.shippingStatus === 'DELIVERING'
      || order.shippingStatus === 'DELIVERED';
  }

  submitReport(): void {
    if (!this.selectedOrder) return;

    // Tạm thời chỉ hiển thị thông báo, có thể nối với API complaint sau
    alert('Đã ghi nhận báo cáo đơn hàng, chúng tôi sẽ xử lý trong thời gian sớm nhất.');
    this.closeReportModal();
  }
}
