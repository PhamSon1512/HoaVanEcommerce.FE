import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-shop-page',
  standalone: true,
  imports: [NgFor],
  templateUrl: './shop-page.component.html',
  styleUrls: ['./shop-page.component.scss'],
  animations: [
    trigger('pageAnimation', [
      transition(':enter', [
        query('.shop-hero', [
          style({ opacity: 0, transform: 'translateY(-20px)' }),
          animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
        ], { optional: true }),
        query('.shop-section', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger(100, [
            animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class ShopPageComponent {
  readonly zaloPhone = '0866154851';

  constructor(private router: Router) { }

  readonly featuredCollections = [
    {
      title: 'Bộ sưu tập Lý - Trần',
      description: 'Hoa văn từ thời kỳ vàng son của Phật giáo Việt Nam',
      imageUrl: '/assets/images/bosuutapLy.png',
      productCount: 45,
      price: '2.500.000 ₫'
    },
    {
      title: 'Bộ sưu tập Lê',
      description: 'Họa tiết rồng phượng thể hiện quyền lực vương triều',
      imageUrl: '/assets/images/bosuutapLe.jpg',
      productCount: 38,
      price: '2.200.000 ₫'
    },
    {
      title: 'Bộ sưu tập Nguyễn',
      description: 'Đường nét tinh xảo từ cung đình Huế',
      imageUrl: '/assets/images/bosuutapNguyen.jpg',
      productCount: 52,
      price: '2.800.000 ₫'
    }
  ];

  readonly shopFeatures = [
    {
      icon: '🎨',
      title: 'Định dạng chất lượng cao',
      description: 'Họa tiết được số hóa ở định dạng chất lượng cao, có thể scale không giới hạn và sử dụng cho các dự án sáng tạo'
    },
    {
      icon: '📦',
      title: 'Tải về ngay lập tức',
      description: 'Sau khi thanh toán, bạn sẽ nhận được link tải về ngay trong email'
    },
    {
      icon: '🔄',
      title: 'Cập nhật miễn phí',
      description: 'Nhận các phiên bản cải tiến và bổ sung mới hoàn toàn miễn phí'
    },
    {
      icon: '💼',
      title: 'Thương mại hóa',
      description: 'Giấy phép cho phép sử dụng thương mại trên mọi sản phẩm'
    }
  ];

  navigateToAllProducts() {
    this.router.navigate(['/danh-muc'], {
      fragment: 'top'
    }).then(() => {
      // Ensure scroll to top after navigation
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  openZalo() {
    window.open(`https://zalo.me/${this.zaloPhone}`, '_blank');
  }

  viewCollection(collection: { title: string }) {
    let categoryName: string | null = null;

    if (collection.title.includes('Lý - Trần')) {
      categoryName = 'Hoa văn thời Lý - Trần';
    } else if (collection.title.includes('Lê')) {
      categoryName = 'Hoa văn thời Lê';
    } else if (collection.title.includes('Nguyễn')) {
      categoryName = 'Hoa văn thời Nguyễn';
    }

    this.router
      .navigate(['/danh-muc'], {
        queryParams: categoryName ? { category: categoryName } : {}
      })
      .then(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
  }
}
