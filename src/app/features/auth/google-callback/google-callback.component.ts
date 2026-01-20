import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-google-callback',
  standalone: true,
  template: `<div class="google-callback">Connexion Google en cours...</div>`,
})
export class GoogleCallbackComponent implements OnInit {
  private router = inject(Router);
  private auth = inject(AuthService);

  ngOnInit(): void {
    // Récupérer le token dans l'URL (query param)
    const url = new URL(window.location.href);
    const token = url.searchParams.get('token');
    if (token) {
      this.auth.handleGoogleCallback(token);
      this.router.navigate(['/dashboard']);
    } else {
      // Pas de token, retour à la page de login
      this.router.navigate(['/login']);
    }
  }
}