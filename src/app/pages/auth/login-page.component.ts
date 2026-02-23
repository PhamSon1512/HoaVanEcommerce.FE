import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  email = '';
  password = '';
  error = '';
  isSubmitting = false;

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.error = '';
    this.isSubmitting = true;
    this.auth.login({ email: this.email, password: this.password }).subscribe(res => {
      this.isSubmitting = false;
      if (!res.ok) {
        this.error = res.message ?? 'Đăng nhập thất bại.';
        return;
      }

      // Sau khi đăng nhập, nếu là admin -> chuyển tới trang quản trị hoa văn
      if (this.auth.isAdmin()) {
        // Sau khi đăng nhập admin, chuyển tới trang quản lý hoa văn
        this.router.navigateByUrl('/admin/hoa-van');
      } else {
        this.router.navigateByUrl('/');
      }
    });
  }
}

