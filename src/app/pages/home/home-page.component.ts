import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgFor } from '@angular/common';
import { ProductCarouselComponent } from '../../shared/components/product-carousel/product-carousel.component';
import { CategoriesApiService } from '../../core/services/categories-api.service';
import { ProductsApiService } from '../../core/services/products-api.service';
import { Category } from '../../core/models/category.model';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [NgFor, ProductCarouselComponent],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  categories: Category[] = [];
  newProducts: Product[] = [];
  featuredProducts: Product[] = [];

  constructor(
    private router: Router,
    private categoriesApi: CategoriesApiService,
    private productsApi: ProductsApiService
  ) {
    this.categoriesApi.getAll().subscribe(cs => (this.categories = cs));
    this.productsApi.getList().subscribe(ps => {
      this.newProducts = ps.slice(0, 8);
      this.featuredProducts = ps.slice(0, 6);
      // Use real product images (from BE) as cover for milestone cards
      for (const section of this.highlightSections) {
        const cover = ps.find(p => p.categoryName === section.categoryName)?.imageUrl;
        if (cover) section.imageUrl = cover;
      }
    });
  }

  readonly heroTitle = 'Nhớ như in';
  readonly heroSubtitle = 'Làm mới lại văn hóa';
  readonly heroDescription =
    'Minh họa và hiện đại hóa kho tàng lịch sử, văn hóa Việt Nam, đưa văn hóa vào đời sống hiện đại.';

  readonly highlightSections = [
    {
      title: 'Hoa văn thời Lý - Trần',
      description: 'Những đường nét mềm mại, uyển chuyển, mang đậm bản sắc Phật giáo và mỹ thuật cung đình Lý - Trần.',
      categoryName: 'Hoa văn thời Lý - Trần',
      imageUrl: '/assets/images/bosuutapLy.png'
    },
    {
      title: 'Hoa văn thời Lê',
      description: 'Các họa tiết rồng, phượng, long mã với bố cục chặt chẽ, thể hiện quyền lực vương triều Lê.',
      categoryName: 'Hoa văn thời Lê',
      imageUrl: '/assets/images/bosuutapLe.jpg'
    },
    {
      title: 'Hoa văn thời Nguyễn',
      description: 'Đường nét tinh xảo, phối hợp nhiều mảng đề tài: thiên nhiên, linh thú, họa tiết cung đình Huế.',
      categoryName: 'Hoa văn thời Nguyễn',
      imageUrl: '/assets/images/bosuutapNguyen.jpg'
    }
  ];

  getProductsByCategoryName(name: string) {
    return this.featuredProducts.filter(p => p.categoryName === name).slice(0, 4);
  }

  getEpochYear(index: number): string {
    const years = ['1009-1400', '1428-1789', '1802-1945'];
    return years[index] || '';
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 120; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  navigateToCategory(categoryName: string) {
    this.router.navigate(['/danh-muc'], { 
      queryParams: { category: categoryName },
      fragment: 'top' // Add fragment to ensure scroll to top
    }).then(() => {
      // Ensure scroll to top after navigation
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

