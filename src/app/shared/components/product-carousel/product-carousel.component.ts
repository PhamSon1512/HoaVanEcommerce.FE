import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-carousel.component.html',
  styleUrls: ['./product-carousel.component.scss']
})
export class ProductCarouselComponent implements OnInit, OnDestroy {
  @Input() products: Product[] = [];
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() autoSlide: boolean = true;
  @Input() slideInterval: number = 4000; // 4 giây

  currentIndex = 0;
  visibleCount = 4; // Số sản phẩm hiển thị cùng lúc
  private slideIntervalId: any;

  constructor(private cart: CartService, private router: Router) { }

  get slideWidth(): number {
    return 100 / this.visibleCount;
  }

  get transformValue(): string {
    return `translateX(-${this.currentIndex * this.slideWidth}%)`;
  }

  ngOnInit() {
    if (this.autoSlide) {
      this.startAutoSlide();
    }
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  get totalSlides(): number {
    return Math.max(0, this.products.length - this.visibleCount + 1);
  }

  get canGoNext(): boolean {
    return this.currentIndex < this.totalSlides - 1;
  }

  get canGoPrev(): boolean {
    return this.currentIndex > 0;
  }

  next() {
    if (this.canGoNext) {
      this.currentIndex += 1;
      this.resetAutoSlide();
    }
  }

  prev() {
    if (this.canGoPrev) {
      this.currentIndex -= 1;
      this.resetAutoSlide();
    }
  }

  goToSlide(index: number) {
    this.currentIndex = index;
    this.resetAutoSlide();
  }

  private startAutoSlide() {
    this.slideIntervalId = setInterval(() => {
      if (this.canGoNext) {
        this.next();
      } else {
        this.currentIndex = 0; // Quay về đầu
      }
    }, this.slideInterval);
  }

  private stopAutoSlide() {
    if (this.slideIntervalId) {
      clearInterval(this.slideIntervalId);
    }
  }

  private resetAutoSlide() {
    this.stopAutoSlide();
    if (this.autoSlide) {
      this.startAutoSlide();
    }
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }

  addToCart(product: Product) {
    this.cart.addProduct(product, 1);
  }

  viewDetail(product: Product) {
    this.router.navigate(['/san-pham', product.id]);
  }
}
