import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string;
}

interface AuthResponseDto {
  id: number;
  email: string;
  fullName?: string;
  token: string;
}

const SESSION_KEY = 'hv_session_user_v1';
const TOKEN_KEY = 'hv_auth_token_v1';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  readonly isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  readonly currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const session = this.readSession();
    const token = this.readToken();
    if (session && token) {
      this.currentUserSubject.next(session);
      this.isLoggedInSubject.next(true);
    }
  }

  get currentUserSnapshot(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Simple check to treat a specific account as admin.
   * Later có thể thay bằng claim/role từ JWT.
   */
  isAdmin(): boolean {
    const user = this.currentUserSnapshot;
    return !!user && user.email.toLowerCase() === 'admin@gmail.com';
  }

  register(payload: { name: string; email: string; password: string; phoneNumber?: string }): Observable<{ ok: boolean; message?: string }> {
    const body = {
      fullName: payload.name,
      email: payload.email,
      password: payload.password,
      phoneNumber: payload.phoneNumber
    };

    return this.http.post<AuthResponseDto>('/api/auth/register', body).pipe(
      tap(res => this.setSessionFromResponse(res)),
      map(() => ({ ok: true })),
      catchError(err => {
        const message = err?.error?.message || 'Đăng ký thất bại.';
        return of({ ok: false, message });
      })
    );
  }

  login(payload: { email: string; password: string }): Observable<{ ok: boolean; message?: string }> {
    const body = {
      email: payload.email,
      password: payload.password
    };

    return this.http.post<AuthResponseDto>('/api/auth/login', body).pipe(
      tap(res => this.setSessionFromResponse(res)),
      map(() => ({ ok: true })),
      catchError(err => {
        const message = err?.error?.message || 'Đăng nhập thất bại.';
        return of({ ok: false, message });
      })
    );
  }

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
  }

  /* =========================
     Storage helpers
     ========================= */

  private setSessionFromResponse(res: AuthResponseDto) {
    const user: User = {
      id: res.id,
      name: res.fullName ?? res.email,
      email: res.email
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_KEY, res.token);
    this.currentUserSubject.next(user);
    this.isLoggedInSubject.next(true);
  }

  private readSession(): User | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }

  private readToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }
}
