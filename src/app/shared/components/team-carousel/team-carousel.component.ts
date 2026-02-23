import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TeamMember {
  name: string;
  role: string;
  description: string;
  imageUrl: string;
}

@Component({
  selector: 'app-team-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team-carousel.component.html',
  styleUrls: ['./team-carousel.component.scss']
})
export class TeamCarouselComponent implements OnInit, OnDestroy {
  @Input() members: TeamMember[] = [];
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() autoSlide: boolean = true;
  @Input() slideInterval: number = 4000; // 4 giây
  @Input() visibleCount: number = 3; // hiển thị 3 thẻ như yêu cầu

  currentIndex = 0;
  private slideIntervalId: any;

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
    return Math.max(0, this.members.length - this.visibleCount + 1);
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

  private startAutoSlide() {
    this.slideIntervalId = setInterval(() => {
      if (this.canGoNext) {
        this.currentIndex += 1;
      } else {
        this.currentIndex = 0; // quay lại từ đầu, giống mô tả lặp
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

  trackByIndex(index: number, _member: TeamMember): number {
    return index;
  }
}

