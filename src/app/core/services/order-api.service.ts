import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrderDto {
  id: number;
  orderCode: string;
  userId: number;
  userName: string;
  userEmail: string;
  totalAmount: number;
  paymentStatus: string;
  shippingStatus: string;
  orderStatus: string;
  paymentMethod: string;
  currentStatusNote?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItemDto[];
  shippingInfo?: OrderShippingInfoDto;
}

export interface OrderItemDto {
  id: number;
  productId: number;
  productName: string;
  productCode: string;
  productImageUrl: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface OrderShippingInfoDto {
  receiverName: string;
  receiverPhone: string;
  fullAddress: string;
  note?: string;
}

export interface CreateOrderRequest {
  cartItemIds: number[];
  shippingName?: string;
  shippingPhone?: string;
  shippingAddress?: string;
  shippingNote?: string;
}

export interface ConfirmPaymentRequest {
  transactionRef?: string;
}

export interface UpdateOrderStatusRequest {
  orderStatus: string;
  paymentStatus?: string;
  shippingStatus?: string;
  note?: string;
}

export interface ConfirmReceivedRequest {
  note?: string;
}

export interface ShopSettingDto {
  id: number;
  bankName: string;
  accountName: string;
  accountNumber: string;
  qrImageUrl: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderApiService {
  private readonly baseUrl = '/api/order';
  private readonly shopSettingUrl = '/api/shopsetting';

  constructor(private http: HttpClient) { }

  createOrder(request: CreateOrderRequest): Observable<OrderDto> {
    return this.http.post<OrderDto>(this.baseUrl, request);
  }

  getOrder(id: number): Observable<OrderDto> {
    return this.http.get<OrderDto>(`${this.baseUrl}/${id}`);
  }

  getMyOrders(): Observable<OrderDto[]> {
    return this.http.get<OrderDto[]>(`${this.baseUrl}/my-orders`);
  }

  getAllOrders(): Observable<OrderDto[]> {
    return this.http.get<OrderDto[]>(`${this.baseUrl}/all`);
  }

  confirmPayment(orderId: number, request: ConfirmPaymentRequest): Observable<OrderDto> {
    return this.http.post<OrderDto>(`${this.baseUrl}/${orderId}/confirm-payment`, request);
  }

  updateOrderStatus(orderId: number, request: UpdateOrderStatusRequest): Observable<OrderDto> {
    return this.http.put<OrderDto>(`${this.baseUrl}/${orderId}/status`, request);
  }

  confirmReceived(orderId: number, request: ConfirmReceivedRequest): Observable<OrderDto> {
    return this.http.post<OrderDto>(`${this.baseUrl}/${orderId}/confirm-received`, request);
  }

  getShopSetting(): Observable<ShopSettingDto> {
    return this.http.get<ShopSettingDto>(this.shopSettingUrl);
  }
}
