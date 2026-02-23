import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductDetail, ProductListItem } from '../models/product.model';

export interface AdminUpsertProductPayload {
  categoryId: number;
  name: string;
  code?: string | null;
  description?: string | null;
  price: number;
  stockQuantity: number;
  isActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class AdminProductsApiService {
  constructor(private http: HttpClient) {}

  getList(opts?: { categoryId?: number | null; search?: string | null }): Observable<ProductListItem[]> {
    let params = new HttpParams();
    if (opts?.categoryId != null) params = params.set('categoryId', String(opts.categoryId));
    if (opts?.search) params = params.set('search', opts.search);
    return this.http.get<ProductListItem[]>('/api/admin/products', { params });
  }

  getById(id: number): Observable<ProductDetail> {
    return this.http.get<ProductDetail>(`/api/admin/products/${id}`);
  }

  create(payload: AdminUpsertProductPayload, imageFile: File): Observable<ProductDetail> {
    const form = new FormData();
    form.append('categoryId', String(payload.categoryId));
    form.append('name', payload.name);
    if (payload.code) form.append('code', payload.code);
    if (payload.description) form.append('description', payload.description);
    form.append('price', String(payload.price));
    form.append('stockQuantity', String(payload.stockQuantity));
    form.append('isActive', String(payload.isActive));
    form.append('image', imageFile);
    return this.http.post<ProductDetail>('/api/admin/products', form);
  }

  update(id: number, payload: AdminUpsertProductPayload, imageFile?: File | null): Observable<ProductDetail> {
    const form = new FormData();
    form.append('categoryId', String(payload.categoryId));
    form.append('name', payload.name);
    if (payload.code) form.append('code', payload.code);
    if (payload.description) form.append('description', payload.description);
    form.append('price', String(payload.price));
    form.append('stockQuantity', String(payload.stockQuantity));
    form.append('isActive', String(payload.isActive));
    if (imageFile) form.append('image', imageFile);
    return this.http.put<ProductDetail>(`/api/admin/products/${id}`, form);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/api/admin/products/${id}`);
  }
}

