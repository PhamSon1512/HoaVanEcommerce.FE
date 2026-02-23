// category-page.component.ts: Logic component, dữ liệu hiển thị, handler event,...

import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { CartService } from '../../core/services/cart.service';
import { CategoriesApiService } from '../../core/services/categories-api.service';
import { ProductsApiService } from '../../core/services/products-api.service';
import { Category } from '../../core/models/category.model';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-category-page',
  standalone: true,
  imports: [NgFor, NgIf, CurrencyPipe, FormsModule],
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.scss'],
  animations: [
    trigger('pageAnimation', [
      transition(':enter', [
        query('.category-hero', [
          style({ opacity: 0, transform: 'translateY(-20px)' }),
          animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
        ]),
        query('.category-sidebar', [
          style({ opacity: 0, transform: 'translateX(-30px)' }),
          animate('500ms ease-out 200ms', style({ opacity: 1, transform: 'translateX(0)' }))
        ]),
        query('.category-toolbar', [
          style({ opacity: 0, transform: 'translateY(-15px)' }),
          animate('500ms ease-out 300ms', style({ opacity: 1, transform: 'translateY(0)' }))
        ]),
        query('.product-card', [
          style({ opacity: 0, transform: 'translateY(20px) scale(0.95)' }),
          stagger(80, [
            animate('500ms cubic-bezier(0.34, 1.56, 0.64, 1)', style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px) scale(0.95)' }),
          stagger(80, [
            animate('500ms cubic-bezier(0.34, 1.56, 0.64, 1)', style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
          ])
        ], { optional: true }),
        query(':leave', [
          animate('300ms ease-in', style({ opacity: 0, transform: 'scale(0.9)' }))
        ], { optional: true })
      ])
    ])
  ]
})
export class CategoryPageComponent implements OnInit {
  categories: Category[] = [];
  selectedCategoryId: number | null = null;
  searchTerm = '';
  products: Product[] = [];
  private pendingCategoryName: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cart: CartService,
    private categoriesApi: CategoriesApiService,
    private productsApi: ProductsApiService
  ) {}

  async ngOnInit() {
    // Scroll to top when component loads
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Load initial data
    this.categoriesApi.getAll().subscribe(cs => {
      this.categories = cs;
      if (this.pendingCategoryName) {
        const category = this.categories.find(c => c.name === this.pendingCategoryName);
        if (category) this.selectedCategoryId = category.id;
        this.pendingCategoryName = null;
      }
    });
    this.productsApi.getList().subscribe(ps => (this.products = ps));

    // Check for category & search query params and set filter accordingly
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        const categoryName = params['category'];
        const category = this.categories.find(c => c.name === categoryName);
        if (category) this.selectedCategoryId = category.id;
        else this.pendingCategoryName = categoryName;
      } else {
        // If no category param, show all (selectedCategoryId = null)
        this.selectedCategoryId = null;
        this.pendingCategoryName = null;
      }

      if (params['q']) {
        this.searchTerm = params['q'];
      }

      // Ensure scroll to top after params are processed
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    });
  }

  get filteredProducts(): Product[] {
    return this.products.filter(p => {
      const matchCategory = this.selectedCategoryId ? p.categoryId === this.selectedCategoryId : true;
      const matchSearch = this.searchTerm
        ? p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          (p.code ?? '').toLowerCase().includes(this.searchTerm.toLowerCase())
        : true;
      return matchCategory && matchSearch;
    });
  }

  selectCategory(id: number | null) {
    this.selectedCategoryId = id;
    // Update URL without reloading
    if (id) {
      const category = this.categories.find(c => c.id === id);
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { category: category?.name },
        queryParamsHandling: 'merge'
      });
    } else {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {}
      });
    }
  }

  addToCart(product: Product) {
    this.cart.addProduct(product, 1);
  }
}

