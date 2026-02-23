import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { OrderApiService, OrderDto, UpdateOrderStatusRequest } from '../../core/services/order-api.service';

@Component({
  selector: 'app-admin-orders-page',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './admin-orders-page.component.html',
  styleUrls: ['./admin-orders-page.component.scss']
})
export class AdminOrdersPageComponent implements OnInit {
  orders: OrderDto[] = [];
  filteredOrders: OrderDto[] = [];
  isLoading = false;
  error: string | null = null;

  // Filters
  searchTerm = '';
  statusFilter = '';
  paymentStatusFilter = '';
  shippingStatusFilter = '';

  // Selected order for status update
  selectedOrder: OrderDto | null = null;
  showStatusModal = false;
  newShippingStatus = '';
  statusNote = '';

  // Status options
  readonly orderStatuses = [
    { value: '', label: 'Tất cả' },
    { value: 'PENDING_PAYMENT', label: 'Chờ thanh toán' },
    { value: 'PAYMENT_PENDING_VERIFY', label: 'Chờ xác minh thanh toán' },
    { value: 'PAYMENT_VERIFIED', label: 'Đã xác minh thanh toán' },
    { value: 'PREPARING', label: 'Đang chuẩn bị hàng' },
    { value: 'SHIPPED', label: 'Đã vận chuyển' },
    { value: 'DELIVERING', label: 'Đang giao hàng' },
    { value: 'COMPLETED', label: 'Hoàn thành' },
    { value: 'CANCELLED', label: 'Đã hủy' }
  ];

  readonly paymentStatuses = [
    { value: '', label: 'Tất cả' },
    { value: 'PENDING', label: 'Chờ thanh toán' },
    { value: 'PENDING_VERIFY', label: 'Chờ xác minh' },
    { value: 'VERIFIED', label: 'Đã xác minh' },
    { value: 'FAILED', label: 'Thất bại' }
  ];

  readonly shippingStatuses = [
    { value: '', label: 'Tất cả' },
    { value: 'NOT_SHIPPED', label: 'Chưa vận chuyển' },
    { value: 'PREPARING', label: 'Đang chuẩn bị' },
    { value: 'SHIPPED', label: 'Đã vận chuyển' },
    { value: 'DELIVERING', label: 'Đang giao hàng' },
    { value: 'DELIVERED', label: 'Đã giao hàng' }
  ];

  constructor(private orderApi: OrderApiService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.error = null;
    this.orderApi.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Có lỗi xảy ra khi tải danh sách đơn hàng.';
        this.isLoading = false;
        console.error('Load orders error:', err);
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.orders];

    // Search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(o =>
        o.orderCode.toLowerCase().includes(term) ||
        o.userName.toLowerCase().includes(term) ||
        o.userEmail.toLowerCase().includes(term) ||
        o.items.some(i => i.productName.toLowerCase().includes(term))
      );
    }

    // Status filters
    if (this.statusFilter) {
      filtered = filtered.filter(o => o.orderStatus === this.statusFilter);
    }
    if (this.paymentStatusFilter) {
      filtered = filtered.filter(o => o.paymentStatus === this.paymentStatusFilter);
    }
    if (this.shippingStatusFilter) {
      filtered = filtered.filter(o => o.shippingStatus === this.shippingStatusFilter);
    }

    this.filteredOrders = filtered;
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  openStatusModal(order: OrderDto): void {
    this.selectedOrder = order;
    this.newShippingStatus = order.shippingStatus;
    this.statusNote = order.currentStatusNote || '';
    this.showStatusModal = true;
  }

  closeStatusModal(): void {
    this.showStatusModal = false;
    this.selectedOrder = null;
    this.statusNote = '';
  }

  updateOrderStatus(): void {
    if (!this.selectedOrder) return;

    this.isLoading = true;
    const request: UpdateOrderStatusRequest = {
      // Giữ nguyên trạng thái đơn và thanh toán, chỉ cập nhật vận chuyển + ghi chú
      orderStatus: this.selectedOrder.orderStatus,
      paymentStatus: this.selectedOrder.paymentStatus || undefined,
      shippingStatus: this.newShippingStatus || undefined,
      note: this.statusNote || undefined
    };

    this.orderApi.updateOrderStatus(this.selectedOrder.id, request).subscribe({
      next: () => {
        this.loadOrders();
        this.closeStatusModal();
        alert('Cập nhật trạng thái đơn hàng thành công!');
      },
      error: (err) => {
        this.error = err?.error?.message || 'Có lỗi xảy ra khi cập nhật trạng thái.';
        this.isLoading = false;
        console.error('Update status error:', err);
      }
    });
  }

  canQuickVerify(order: OrderDto): boolean {
    return order.paymentStatus === 'PENDING_VERIFY' || order.orderStatus === 'PAYMENT_PENDING_VERIFY';
  }

  quickVerifyPayment(order: OrderDto): void {
    if (!this.canQuickVerify(order)) {
      return;
    }

    const ok = confirm(`Xác nhận đã xác minh thanh toán cho đơn "${order.orderCode}"?`);
    if (!ok) return;

    this.isLoading = true;
    const request: UpdateOrderStatusRequest = {
      orderStatus: 'PAYMENT_VERIFIED',
      paymentStatus: 'VERIFIED',
      shippingStatus: order.shippingStatus || undefined,
      note: order.currentStatusNote || undefined
    };

    this.orderApi.updateOrderStatus(order.id, request).subscribe({
      next: () => {
        this.loadOrders();
        alert('Đã xác minh thanh toán cho đơn hàng.');
      },
      error: (err) => {
        this.error = err?.error?.message || 'Có lỗi xảy ra khi xác minh thanh toán.';
        this.isLoading = false;
        console.error('Quick verify error:', err);
      }
    });
  }

  getStatusLabel(status: string, type: 'order' | 'payment' | 'shipping'): string {
    const statusMap: Record<string, string> = {
      // Order statuses
      'PENDING_PAYMENT': 'Chờ thanh toán',
      'PAYMENT_PENDING_VERIFY': 'Chờ xác minh thanh toán',
      'PAYMENT_VERIFIED': 'Đã xác minh thanh toán',
      'PREPARING': 'Đang chuẩn bị hàng',
      'SHIPPED': 'Đã vận chuyển',
      'DELIVERING': 'Đang giao hàng',
      'COMPLETED': 'Hoàn thành',
      'CANCELLED': 'Đã hủy',
      // Payment statuses
      'PENDING': 'Chờ thanh toán',
      'PENDING_VERIFY': 'Chờ xác minh',
      'VERIFIED': 'Đã xác minh',
      'FAILED': 'Thất bại',
      // Shipping statuses
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
    // Order status
    if (status === 'COMPLETED') return 'status-badge--success';
    if (status === 'CANCELLED') return 'status-badge--danger';
    if (status === 'PREPARING' || status === 'SHIPPED' || status === 'DELIVERING') return 'status-badge--warning';
    return 'status-badge--info';
  }
}
