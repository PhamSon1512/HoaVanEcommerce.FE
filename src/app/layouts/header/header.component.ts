import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { AuthService, User } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  currentLanguage: 'vi' | 'en' = 'vi';
  isLanguageMenuOpen = false;

  isLoggedIn$: Observable<boolean>;
  currentUser$: Observable<User | null>;
  isAdmin$: Observable<boolean>;
  cartCount = 0;
  isSearchOpen = false;
  searchQuery = '';

  constructor(
    private authService: AuthService,
    private cart: CartService,
    private router: Router
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.currentUser$ = this.authService.currentUser$;
    
    // Combine isLoggedIn and isAdmin check
    this.isAdmin$ = this.authService.currentUser$.pipe(
      map(user => {
        if (!user) return false;
        return this.authService.isAdmin();
      })
    );

    this.cart.cart$.subscribe(state => {
      this.cartCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
    });
  }

  toggleLanguage() {
    this.isLanguageMenuOpen = !this.isLanguageMenuOpen;
  }

  selectLanguage(lang: 'vi' | 'en') {
    this.currentLanguage = lang;
    this.isLanguageMenuOpen = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }

  toggleSearch() {
    this.isSearchOpen = !this.isSearchOpen;
  }

  submitSearch() {
    const query = this.searchQuery.trim();
    this.isSearchOpen = false;

    this.router.navigate(['/danh-muc'], {
      queryParams: query ? { q: query } : {}
    }).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

