import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';
import { apiBaseUrlInterceptor } from './app/core/interceptors/api-base-url.interceptor';
import '@angular/common/locales/global/vi';

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideHttpClient(withInterceptors([apiBaseUrlInterceptor])),
    provideRouter(appRoutes)
  ]
}).catch(err => console.error(err));

