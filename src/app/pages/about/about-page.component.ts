import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { TeamCarouselComponent } from '../../shared/components/team-carousel/team-carousel.component';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [NgFor, TeamCarouselComponent],
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss'],
  animations: [
    trigger('pageAnimation', [
      transition(':enter', [
        query('.about-hero', [
          style({ opacity: 0, transform: 'translateY(-20px)' }),
          animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
        ]),
        query('.about-section', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger(100, [
            animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ])
      ])
    ])
  ]
})
export class AboutPageComponent {
  readonly zaloPhone = '0866154851';

  readonly mission = {
    title: 'Sứ mệnh của chúng tôi',
    description: 'Nhớ như in được thành lập với mong muốn bảo tồn và phát huy giá trị văn hóa lịch sử, văn hóa Việt Nam thông qua công nghệ số. Chúng tôi tin rằng di sản văn hóa không chỉ cần được bảo tồn mà còn cần được sống lại, được ứng dụng trong cuộc sống hiện đại.',
    values: [
      {
        icon: '🏛️',
        title: 'Tôn trọng lịch sử',
        description: 'Mỗi hoa văn đều được nghiên cứu kỹ lưỡng từ các nguồn tư liệu lịch sử chính thống'
      },
      {
        icon: '🎨',
        title: 'Chất lượng cao',
        description: 'Số hóa ở độ phân giải cao, đảm bảo chi tiết và độ chính xác tuyệt đối'
      },
      {
        icon: '🌱',
        title: 'Phát triển bền vững',
        description: 'Góp phần vào việc bảo tồn và lan tỏa giá trị văn hóa Việt Nam'
      },
      {
        icon: '🤝',
        title: 'Cộng đồng',
        description: 'Xây dựng cộng đồng yêu thích và ứng dụng hoa văn cổ trong thiết kế'
      }
    ]
  };

  readonly team = [
    {
      name: 'Nguyễn Văn A',
      role: 'Nhà nghiên cứu văn hóa',
      description: 'Chuyên gia về hoa văn cổ Việt Nam với hơn 15 năm kinh nghiệm',
      imageUrl: '/assets/images/GachHoaThoiLy.jpg'
    },
    {
      name: 'Trần Thị B',
      role: 'Designer & Số hóa',
      description: 'Chuyên viên số hóa và vector hóa hoa văn với độ chính xác cao',
      imageUrl: '/assets/images/hoavanRong.jpg'
    },
    {
      name: 'Lê Văn C',
      role: 'Phát triển sản phẩm',
      description: 'Phụ trách phát triển và cải tiến nền tảng số hóa hoa văn',
      imageUrl: '/assets/images/hoavanphuong01.jpg'
    },
    {
      name: 'Phạm Thị D',
      role: 'Marketing & Community',
      description: 'Kết nối cộng đồng yêu thích hoa văn cổ và lan tỏa giá trị văn hóa',
      imageUrl: '/assets/images/GachHoaThoiLy.jpg'
    },
    {
      name: 'Đỗ Văn E',
      role: 'Kỹ sư phần mềm',
      description: 'Xây dựng và tối ưu nền tảng thương mại điện tử Hoa Văn Đại Việt',
      imageUrl: '/assets/images/hoavanRong.jpg'
    },
    {
      name: 'Hoàng Thị F',
      role: 'Chăm sóc khách hàng',
      description: 'Hỗ trợ khách hàng trong quá trình lựa chọn và sử dụng hoa văn',
      imageUrl: '/assets/images/hoavanphuong01.jpg'
    }
  ];

  readonly timeline = [
    {
      year: 'Tháng 9/2025',
      title: 'Lên ý tưởng về dự án',
      description: 'Khởi động ý tưởng về dự án bảo tồn và phát huy hoa văn cổ Việt Nam'
    },
    {
      year: 'Tháng 10/2025',
      title: 'Chuẩn bị kế hoạch',
      description: 'Chuẩn bị kế hoạch về kinh doanh và sản phẩm'
    },
    {
      year: 'Tháng 11/2025',
      title: 'Sơ thảo sản phẩm',
      description: 'Đưa ra bản sơ thảo về sản phẩm kinh doanh'
    },
    {
      year: 'Tháng 12/2025',
      title: 'Nghiên cứu và sáng tạo',
      description: 'Nghiên cứu, sáng tạo sản phẩm'
    },
    {
      year: 'Tháng 2/2026',
      title: 'Ra mắt sản phẩm',
      description: 'Chính thức ra mắt sản phẩm ra thị trường'
    }
  ];

  openZalo() {
    window.open(`https://zalo.me/${this.zaloPhone}`, '_blank');
  }
}
