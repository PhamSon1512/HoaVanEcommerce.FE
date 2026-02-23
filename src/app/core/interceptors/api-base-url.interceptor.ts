import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment'; 

const API_BASE_URL = environment.apiUrl; 
const TOKEN_KEY = 'hv_auth_token_v1';

export const apiBaseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  let updatedReq = req;

  if (!updatedReq.url.startsWith('http')) {
    const url = updatedReq.url.startsWith('/') ? updatedReq.url : `/${updatedReq.url}`;
    
    if (API_BASE_URL) {
      const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    updatedReq = updatedReq.clone({ url: baseUrl + url });
    } else {
      updatedReq = updatedReq.clone({ url });
    }
  }

  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    updatedReq = updatedReq.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(updatedReq);
};