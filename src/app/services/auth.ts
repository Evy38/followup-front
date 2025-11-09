import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // poru envoyer requêtes à l'API symfony
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root', // Service accessible de partout dans l'app
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api'; // Ton backend Symfony

  // On utilise un signal Angular pour stocker l’état de connexion
  isLoggedIn = signal<boolean>(false);

  constructor(private http: HttpClient) { }

  // Connexion → envoie email + password à Symfony
  login(email: string, password: string) {
    return this.http
      .post<{ token: string }>(`${this.API_URL}/login_check`, { email, password }) // envoi les donnée d'id à l'API
      .pipe(
        tap((response) => {
          // Si on reçoit un token, on le sauvegarde
          localStorage.setItem('jwt', response.token);
          this.isLoggedIn.set(true);
        })
      );
  }

  register(email: string, password: string) {
    return this.http.post(`${this.API_URL}/register`, { email, password });
  }

  // Déconnexion → on supprime le token du stockage local
  logout() {
    localStorage.removeItem('jwt');
    this.isLoggedIn.set(false);
  }

  // Vérifie si un utilisateur est connecté
  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
