import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AdminProductsApiService, AdminUpsertProductPayload } from '../../core/services/admin-products-api.service';
import { CategoriesApiService } from '../../core/services/categories-api.service';
import { Category } from '../../core/models/category.model';
import { ProductListItem } from '../../core/models/product.model';

@Component({
  selector: 'app-admin-products-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './admin-products-page.component.html',
  styleUrls: ['./admin-products-page.component.scss']
})
export class AdminProductsPageComponent {
  categories: Category[] = [];
  products: ProductListItem[] = [];

  search = '';
  categoryId: number | null = null;
  loading = false;
  error: string | null = null;

  isFormOpen = false;
  editingId: number | null = null;
  selectedImageFile: File | null = null;
  previewUrl: string | null = null;

  form: AdminUpsertProductPayload = {
    categoryId: 0,
    name: '',
    code: '',
    description: '',
    price: 0,
    stockQuantity: 0,
    isActive: true
  };

  constructor(
    private adminProductsApi: AdminProductsApiService,
    private categoriesApi: CategoriesApiService
  ) {
    this.categoriesApi.getAll().subscribe(cs => {
      this.categories = cs;
      if (!this.form.categoryId && cs.length) this.form.categoryId = cs[0].id;
    });
    this.refresh();
  }

  refresh() {
    this.loading = true;
    this.error = null;
    this.adminProductsApi.getList({ categoryId: this.categoryId, search: this.search }).subscribe({
      next: ps => {
        this.products = ps;
        this.loading = false;
      },
      error: err => {
        this.error = err?.error?.message || 'Không tải được danh sách hoa văn.';
        this.loading = false;
      }
    });
  }

  openCreate() {
    this.editingId = null;
    this.isFormOpen = true;
    this.selectedImageFile = null;
    this.previewUrl = null;
    this.form = {
      categoryId: this.categories[0]?.id ?? 0,
      name: '',
      code: '',
      description: '',
      price: 0,
      stockQuantity: 0,
      isActive: true
    };
  }

  openEdit(p: ProductListItem) {
    this.editingId = p.id;
    this.isFormOpen = true;
    this.selectedImageFile = null;
    this.previewUrl = p.imageUrl || null;
    this.form = {
      categoryId: p.categoryId,
      name: p.name,
      code: p.code ?? '',
      description: '',
      price: p.price,
      stockQuantity: 0,
      isActive: p.isActive
    };

    // Load detail to fill description/stockQuantity (not included in list DTO)
    this.adminProductsApi.getById(p.id).subscribe({
      next: d => {
        this.form.description = d.description ?? '';
        this.form.stockQuantity = d.stockQuantity ?? 0;
      }
    });
  }

  closeForm() {
    this.isFormOpen = false;
    this.editingId = null;
    this.selectedImageFile = null;
    this.previewUrl = null;
  }

  onFileChange(evt: Event) {
    const input = evt.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.selectedImageFile = file;
    this.previewUrl = file ? URL.createObjectURL(file) : this.previewUrl;
  }

  save() {
    this.error = null;
    const payload: AdminUpsertProductPayload = {
      categoryId: Number(this.form.categoryId),
      name: this.form.name.trim(),
      code: this.form.code?.trim() || null,
      description: this.form.description?.trim() || null,
      price: Number(this.form.price),
      stockQuantity: Number(this.form.stockQuantity),
      isActive: !!this.form.isActive
    };

    if (!payload.categoryId || !payload.name) {
      this.error = 'Vui lòng nhập đầy đủ Tên + Danh mục.';
      return;
    }

    this.loading = true;

    if (this.editingId == null) {
      if (!this.selectedImageFile) {
        this.error = 'Vui lòng chọn ảnh hoa văn.';
        this.loading = false;
        return;
      }

      this.adminProductsApi.create(payload, this.selectedImageFile).subscribe({
        next: () => {
          this.loading = false;
          this.closeForm();
          this.refresh();
        },
        error: err => {
          this.error = err?.error?.message || 'Tạo hoa văn thất bại.';
          this.loading = false;
        }
      });
      return;
    }

    this.adminProductsApi.update(this.editingId, payload, this.selectedImageFile).subscribe({
      next: () => {
        this.loading = false;
        this.closeForm();
        this.refresh();
      },
      error: err => {
        this.error = err?.error?.message || 'Cập nhật hoa văn thất bại.';
        this.loading = false;
      }
    });
  }

  delete(p: ProductListItem) {
    const ok = confirm(`Xóa hoa văn "${p.name}"?`);
    if (!ok) return;

    this.loading = true;
    this.adminProductsApi.delete(p.id).subscribe({
      next: () => {
        this.loading = false;
        this.refresh();
      },
      error: err => {
        this.error = err?.error?.message || 'Xóa thất bại.';
        this.loading = false;
      }
    });
  }

  // Dashboard quick stats
  get totalProducts(): number {
    return this.products.length;
  }

  get activeProducts(): number {
    return this.products.filter(p => p.isActive).length;
  }

  get inactiveProducts(): number {
    return this.totalProducts - this.activeProducts;
  }

  getCategoryNameById(id: number | null | undefined): string {
    if (!id) return 'Chưa chọn danh mục';
    const cat = this.categories.find(c => c.id === id);
    return cat?.name ?? 'Chưa chọn danh mục';
  }
}

