import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductDetail, ProductListItem } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductsApiService {
  constructor(private http: HttpClient) {}

  getList(opts?: { categoryId?: number | null; search?: string | null }): Observable<ProductListItem[]> {
    let params = new HttpParams();
    if (opts?.categoryId != null) params = params.set('categoryId', String(opts.categoryId));
    if (opts?.search) params = params.set('search', opts.search);
    return this.http.get<ProductListItem[]>('/api/products', { params });
  }

  getById(id: number): Observable<ProductDetail> {
    return this.http.get<ProductDetail>(`/api/products/${id}`);
  }
}

