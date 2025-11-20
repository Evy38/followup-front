import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api';
  isLoggedIn = signal<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Vérifier si déjà connecté au démarrage
    this.isLoggedIn.set(this.isLogged());
  }

  login(email: string, password: string) {
    return this.http
      .post<{ token: string }>(`${this.API_URL}/login_check`, { email, password })
      .pipe(
        tap((response) => {
          // ✅ Utiliser 'token' partout
          localStorage.setItem('token', response.token);
          this.isLoggedIn.set(true);
          // ✅ Rediriger vers le dashboard
          this.router.navigate(['/dashboard']);
        })
      );
  }

  register(payload: {
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post('http://localhost:8080/api/register', payload);
  }

  logout() {
    localStorage.removeItem('token');
    this.isLoggedIn.set(false);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLogged(): boolean {
    return !!this.getToken();
  }

  // Alias pour compatibilité
  isAuthenticated(): boolean {
    return this.isLogged();
  }
}