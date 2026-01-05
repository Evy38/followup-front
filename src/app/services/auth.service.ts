import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

// Interface pour l'inscription
export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Base API (endpoints REST /api/...)
  private apiUrl = 'http://localhost:8080/api';
  // Base pour OAuth (tes routes /auth/google)
  private oauthBase = 'http://localhost:8080';

  private tokenSubject = new BehaviorSubject<string | null>(null);
  public token$ = this.tokenSubject.asObservable();
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      const token = this.getToken();
      this.tokenSubject.next(token);
    }
  }

  private getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem('token');
  }

  private setToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem('token', token);
      this.tokenSubject.next(token);
    }
  }

  private removeToken(): void {
    if (this.isBrowser) {
      localStorage.removeItem('token');
      this.tokenSubject.next(null);
    }
  }

  isLogged(): boolean {
    return !!this.getToken();
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login_check`, {
      username: email,
      password
    }).pipe(
      tap((response: any) => {
        if (response?.token) {
          this.setToken(response.token);
          this.router.navigate(['/dashboard']);
        }
      })
    );
  }

  register(payload: RegisterPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, payload);
  }

  forgotPassword(email: string): Observable<any> {
    console.log('📧 AuthService: envoi requête forgot password', email);
    return this.http.post(`${this.apiUrl}/password/request`, { email }).pipe(
      tap({
        next: (response) => console.log('📧 AuthService: réponse reçue', response),
        error: (error) => console.error('📧 AuthService: erreur', error),
        complete: () => console.log('📧 AuthService: complete')
      })
    );
  }

  logout(): void {
    this.removeToken();
    this.router.navigate(['/login']);
  }

  googleLogin(): void {
    if (this.isBrowser) {
      window.location.href = `${this.oauthBase}/auth/google`;
    }
  }

  handleGoogleCallback(token: string): void {
    this.setToken(token);
  }
}