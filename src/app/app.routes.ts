import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home-page.component';
import { CategoryPageComponent } from './pages/category/category-page.component';
import { ShopPageComponent } from './pages/shop/shop-page.component';
import { NewsPageComponent } from './pages/news/news-page.component';
import { NewsDetailComponent } from './pages/news/news-detail.component';
import { AboutPageComponent } from './pages/about/about-page.component';
import { LoginPageComponent } from './pages/auth/login-page.component';
import { RegisterPageComponent } from './pages/auth/register-page.component';
import { AdminProductsPageComponent } from './pages/admin/admin-products-page.component';
import { AdminOrdersPageComponent } from './pages/admin/admin-orders-page.component';
import { CartPageComponent } from './pages/cart/cart-page.component';
import { UserOrdersPageComponent } from './pages/user/user-orders-page.component';
import { ProductDetailPageComponent } from './pages/product-detail/product-detail-page.component';

export const appRoutes: Routes = [
  { path: '', component: HomePageComponent, pathMatch: 'full' },
  { path: 'danh-muc', component: CategoryPageComponent },
  { path: 'san-pham/:id', component: ProductDetailPageComponent },
  { path: 'cua-hang', component: ShopPageComponent },
  { path: 'tin-tuc', component: NewsPageComponent },
  { path: 'tin-tuc/:id', component: NewsDetailComponent },
  { path: 've-chung-toi', component: AboutPageComponent },
  { path: 'admin/hoa-van', component: AdminProductsPageComponent },
  { path: 'admin/orders', component: AdminOrdersPageComponent },
  { path: 'dang-nhap', component: LoginPageComponent },
  { path: 'dang-ky', component: RegisterPageComponent },
  { path: 'gio-hang', component: CartPageComponent },
  { path: 'don-hang', component: UserOrdersPageComponent },
  { path: '**', redirectTo: '' }
];

