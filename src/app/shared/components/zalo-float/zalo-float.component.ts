import { Component } from '@angular/core';

@Component({
  selector: 'app-zalo-float',
  standalone: true,
  templateUrl: './zalo-float.component.html',
  styleUrls: ['./zalo-float.component.scss']
})
export class ZaloFloatComponent {
  zaloPhone = '0866154851'; // Số điện thoại Zalo.

  openZalo() {
    window.open(`https://zalo.me/${this.zaloPhone}`, '_blank');
  }
}
