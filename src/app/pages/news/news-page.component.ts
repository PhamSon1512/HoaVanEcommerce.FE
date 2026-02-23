import { Component, OnInit } from '@angular/core';
import { NgFor, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-news-page',
  standalone: true,
  imports: [NgFor, DatePipe],
  templateUrl: './news-page.component.html',
  styleUrls: ['./news-page.component.scss'],
  animations: [
    trigger('pageAnimation', [
      transition(':enter', [
        query('.news-hero', [
          style({ opacity: 0, transform: 'translateY(-20px)' }),
          animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
        ]),
        query('.news-card', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger(100, [
            animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ])
      ])
    ])
  ]
})
export class NewsPageComponent implements OnInit {
  private renderKey = 0;

  constructor(private router: Router) {}

  ngOnInit() {
    const state = window.history.state as any;

    if (state?.scrollToTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (state?.replayAnimations) {
      this.renderKey++;
    }
  }

  get pageAnimationKey() {
    return this.renderKey;
  }

  readonly featuredNews = {
    id: 'thanh-toa-viet-nam-va-trung-hoa',
    title: 'Thần thoại Việt Nam và thần thoại Trung Hoa',
    excerpt:
      'Thần thoại không chỉ là những câu chuyện cổ xưa mà còn là kho tàng biểu tượng văn hóa phong phú, đặc biệt là nguồn cảm hứng lớn cho việc tái thiết kế hoa văn truyền thống Việt Nam và Trung Hoa.',
    imageUrl: '/assets/images/tintuc01.png',
    date: new Date('2021-03-30'),
    category: 'Văn hóa'
  };

  readonly newsList = [
    {
      id: 'nghien-cuu-ngon-ngu-hoc-ve-nguon-goc-tieng-viet',
      title: 'Nghiên cứu ngôn ngữ học về nguồn gốc tiếng Việt',
      excerpt:
        'Một nghiên cứu ngôn ngữ học lịch sử chi tiết đã khẳng định tiếng Việt thuộc tiểu nhánh Vietic (Việt-Mường) trong hệ ngôn ngữ Nam Á (Austroasiatic), cụ thể là nhánh Môn-Khmer...',
      imageUrl: '/assets/images/tintuc02.png',
      date: new Date('2024-08-02'),
      category: 'Ngôn ngữ'
    },
    {
      id: 'lich-su-trang-phuc-thoi-hung-vuong',
      title: 'Lịch sử trang phục thời Hùng Vương',
      excerpt:
        'Nghiên cứu mới về trang phục thời Hùng Vương đã bác bỏ hoàn toàn hình ảnh quen thuộc “cởi trần đóng khố, sống nguyên thủy” và chứng minh người Việt cổ đã sở hữu hệ thống trang phục đa dạng, tinh xảo...',
      imageUrl: '/assets/images/tintuc03.png',
      date: new Date('2021-11-08'),
      category: 'Lịch sử',
    },
    {
      id: 'tim-hieu-ve-nguon-goc-cua-toc-nguoi-hoa-ha',
      title: 'Tìm hiểu về nguồn gốc của tộc người Hoa Hạ',
      excerpt:
        'Các nghiên cứu di truyền và khảo cổ hiện đại đã làm sáng tỏ nguồn gốc tộc người Hoa Hạ (tổ tiên chính của người Hán phía Bắc), chứng minh họ chủ yếu hình thành từ nhóm người Khương...',
      imageUrl: '/assets/images/tintuc04.png',
      date: new Date('2021-11-23'),
      category: 'Lịch sử',
    },
    {
      id: 'di-tim-mot-nua-tien-rong-nguon-goc-chim-tien',
      title: 'Đi tìm một nửa Tiên Rồng: nguồn gốc chim Tiên',
      excerpt:
        'Nghiên cứu mới khẳng định "chim Lạc" quen thuộc trên trống đồng Đông Sơn chính là hình tượng chim Tiên (Phượng Hoàng) – một nửa vật tổ lưỡng hợp Tiên-Rồng của người Việt...',
      imageUrl: '/assets/images/tintuc05.png',
      date: new Date('2021-05-28'),
      category: 'Lịch sử',
    },
    {
      id: 'phong-tuc-di-chan-tran-cua-nguoi-viet',
      title: 'Phong tục đi chân trần của người Việt',
      excerpt:
        'Phong tục đi chân trần – một nét văn hóa đặc trưng của người Việt từ thời Hùng Vương đến tận thời trung đại – không xuất phát từ nghèo đói mà mang ý nghĩa triết lý sâu sắc về cân bằng âm dương và sức khỏe...',
      imageUrl: '/assets/images/tintuc06.png',
      date: new Date('2021-10-14'),
      category: 'Văn hóa',
    },
    {
      id: 'cau-chuyen-ve-nguon-goc-cua-tet',
      title: 'Câu chuyện về nguồn gốc của Tết',
      excerpt:
        'Tết Nguyên Đán không phải “bản quyền” độc quyền của bất kỳ dân tộc nào, mà là nhu cầu tự nhiên chung của nhân loại – kết thúc năm cũ, chào đón năm mới. Với người Việt, Tết đã tồn tại từ thời Hùng Vương...',
      imageUrl: '/assets/images/tintuc07.png',
      date: new Date('2024-02-09'),
      category: 'Văn hóa'
    }
  ];

  openDetail(id: string) {
    this.router.navigate(['/tin-tuc', id]);
  }
}
