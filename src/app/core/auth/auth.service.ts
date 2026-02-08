import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

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

private readonly apiUrl = environment.apiUrl;
private readonly backendUrl = environment.backendUrl;

  private tokenSubject = new BehaviorSubject<string | null>(null);
  public token$ = this.tokenSubject.asObservable();
  private isBrowser: boolean;
  private userSubject = new BehaviorSubject<any | null>(null);
  user$ = this.userSubject.asObservable();


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

  removeToken(): void {
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
      email,
      password
    }).pipe(
      tap((response: any) => {
        if (response?.token) {
          this.setToken(response.token);
        }
      })
    );
  }


  register(payload: RegisterPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, payload);
  }

  forgotPassword(email: string): Observable<any> {
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
    this.router.navigate([
      {
        outlets: {
          primary: '',
          overlay: 'login'
        }
      }
    ]);
  }


  googleLogin(): void {
    if (this.isBrowser) {
      window.location.href = `${this.backendUrl}/auth/google`;
    }
  }

  handleGoogleCallback(token: string): void {
    this.setToken(token);
  }

  me() {
    return this.http.get<any>(`${this.apiUrl}/me`).pipe(
      tap((res) => {
        if (res?.authenticated) {
          this.userSubject.next(res.user);
        } else {
          this.userSubject.next(null);
        }
      })
    );
  }

  get currentUser() {
    return this.userSubject.value;
  }


  resendVerificationEmail(email: string) {
    return this.http.post(`${this.apiUrl}/verify-email/resend`, { email });
  }

  private authErrorSubject = new BehaviorSubject<string | null>(null);
  authError$ = this.authErrorSubject.asObservable();

  setAuthError(message: string) {
    this.authErrorSubject.next(message);
  }

  clearAuthError() {
    this.authErrorSubject.next(null);
  }


}