import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf, NgFor, CurrencyPipe, DecimalPipe } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';
import { trigger, transition, style, animate } from '@angular/animations';
import { ProductsApiService } from '../../core/services/products-api.service';
import { CartService } from '../../core/services/cart.service';
import { ProductDetail, ProductListItem } from '../../core/models/product.model';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe, DecimalPipe, RouterLink],
  templateUrl: './product-detail-page.component.html',
  styleUrls: ['./product-detail-page.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(24px)' }),
        animate('500ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(40px)' }),
        animate('600ms 100ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ProductDetailPageComponent implements OnInit, OnDestroy {
  product: ProductDetail | null = null;
  relatedProducts: ProductListItem[] = [];
  isLoading = true;
  notFound = false;
  quantity = 1;
  addedToCart = false;

  // Simulated rating data (backend has no ratings table yet)
  readonly ratingScore = 4.8;
  readonly reviewCount = 127;
  readonly soldCount = 3200;

  // Simulated reviews
  readonly reviews = [
    {
      avatar: '👤',
      name: 'Nguyễn Thị Lan',
      date: '20/02/2026',
      stars: 5,
      comment: 'Hoa văn rất đẹp, sắc nét, chất lượng file cao. Sử dụng cho dự án thiết kế vải rất ưng!'
    },
    {
      avatar: '👤',
      name: 'Trần Văn Minh',
      date: '15/02/2026',
      stars: 5,
      comment: 'Hình ảnh chất lượng cao, tỉ lệ thực, dùng được ngay. Shop hỗ trợ nhiệt tình.'
    },
    {
      avatar: '👤',
      name: 'Lê Hương Giang',
      date: '10/02/2026',
      stars: 4,
      comment: 'Sản phẩm đúng như mô tả. Tải về nhanh, dùng cho Photoshop rất tiện. Sẽ ủng hộ thêm!'
    }
  ];

  private readonly destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productsApi: ProductsApiService,
    private cart: CartService
  ) {}

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    this.route.params
      .pipe(
        takeUntil(this.destroy$),
        switchMap(params => {
          const id = Number(params['id']);
          this.isLoading = true;
          this.notFound = false;
          this.product = null;
          this.quantity = 1;
          this.addedToCart = false;
          return this.productsApi.getById(id);
        })
      )
      .subscribe({
        next: (product) => {
          this.product = product;
          this.isLoading = false;
          window.scrollTo({ top: 0, behavior: 'smooth' });
          // Load related products from same category
          this.productsApi.getList({ categoryId: product.categoryId }).subscribe(list => {
            this.relatedProducts = list.filter(p => p.id !== product.id).slice(0, 4);
          });
        },
        error: (err) => {
          this.isLoading = false;
          if (err.status === 404) {
            this.notFound = true;
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get starsArray(): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < Math.round(this.ratingScore));
  }

  increaseQty(): void {
    if (this.product && this.quantity < this.product.stockQuantity) {
      this.quantity++;
    }
  }

  decreaseQty(): void {
    if (this.quantity > 1) this.quantity--;
  }

  setQty(val: number): void {
    const max = this.product?.stockQuantity ?? 99;
    this.quantity = Math.max(1, Math.min(val, max));
  }

  addToCart(): void {
    if (!this.product || this.product.stockQuantity === 0) return;
    this.cart.addProduct(
      {
        id: this.product.id,
        categoryId: this.product.categoryId,
        categoryName: this.product.categoryName,
        name: this.product.name,
        code: this.product.code,
        price: this.product.price,
        imageUrl: this.product.imageUrl,
        isActive: this.product.isActive
      },
      this.quantity
    );
    this.addedToCart = true;
    setTimeout(() => (this.addedToCart = false), 2500);
  }

  buyNow(): void {
    this.addToCart();
    this.router.navigate(['/gio-hang']);
  }

  goToRelated(id: number): void {
    this.router.navigate(['/san-pham', id]).then(() =>
      window.scrollTo({ top: 0, behavior: 'smooth' })
    );
  }
}
