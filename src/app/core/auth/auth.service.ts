/**
 * Service d'authentification.
 *
 * Gère l'ensemble du cycle d'authentification :
 * - Connexion / déconnexion par email+password
 * - OAuth Google (redirection + callback)
 * - Vérification de la session courante via `/api/me`
 * - Exposition de l'utilisateur courant via `user$` (BehaviorSubject)
 * - Gestion des erreurs d'authentification (authError$)
 * - Enregistrement du consentement RGPD
 *
 * Le token JWT est transporté en cookie HttpOnly — aucun stockage localStorage.
 * Le cookie est envoyé automatiquement par le navigateur via {@link credentialsInterceptor}.
 */
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  consentRgpd: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = environment.apiUrl;
  private readonly backendUrl = environment.backendUrl;
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  isLogged(): boolean {
    return !!this.userSubject.value;
  }

  login(email: string, password: string): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/login_check`, { email, password });
  }

  register(payload: RegisterPayload): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/register`, payload);
  }

  forgotPassword(email: string): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/password/request`, { email });
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
      complete: () => {
        this.userSubject.next(null);
        this.router.navigate([{ outlets: { primary: '', overlay: 'login' } }]);
      },
      error: () => {
        this.userSubject.next(null);
        this.router.navigate([{ outlets: { primary: '', overlay: 'login' } }]);
      }
    });
  }

  googleLogin(): void {
    window.location.href = `${this.backendUrl}/auth/google`;
  }

  handleGoogleCallback(): void {
    // Le cookie est posé par le backend avant la redirection — rien à faire ici
  }

  me(): Observable<{ authenticated: boolean; verified?: boolean; user?: User }> {
    return this.http.get<{ authenticated: boolean; verified?: boolean; user?: User }>(`${this.apiUrl}/me`).pipe(
      tap((res) => {
        if (res?.authenticated) {
          this.userSubject.next(res.user ?? null);
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

  acceptRgpd() {
    return this.http.post(`${this.apiUrl}/me/consent`, {});
  }

  updateUserInMemory(user: User): void {
    this.userSubject.next(user);
  }
}
