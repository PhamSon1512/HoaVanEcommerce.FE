import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent {
  name = '';
  email = '';
  phoneNumber = '';
  password = '';
  error = '';
  isSubmitting = false;
  readonly namePattern = '^[^0-9]*$';
  readonly passwordMinLength = 6;

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    // Kiểm tra nhanh phía client trước khi gọi API
    if (!this.name || /\d/.test(this.name)) {
      this.error = 'Họ và tên không được chứa số.';
      return;
    }

    if (!this.email) {
      this.error = 'Email không được để trống.';
      return;
    }

    // Đảm bảo mật khẩu có độ dài tối thiểu
    if (!this.password || this.password.length < this.passwordMinLength) {
      this.error = `Mật khẩu phải có ít nhất ${this.passwordMinLength} ký tự.`;
      return;
    }

    this.error = '';
    this.isSubmitting = true;
    this.auth
      .register({
        name: this.name,
        email: this.email,
        password: this.password,
        phoneNumber: this.phoneNumber
      })
      .subscribe(res => {
        this.isSubmitting = false;
        if (!res.ok) {
          this.error = res.message ?? 'Đăng ký thất bại.';
          return;
        }
        this.router.navigateByUrl('/');
      });
  }
}

