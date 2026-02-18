import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-google-callback',
  standalone: true,
  template: `<div class="google-callback">Connexion Google en cours...</div>`,
})
export class GoogleCallbackComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    console.log('🔍 Google Callback - Token reçu:', token);
    
    if (token) {
      this.auth.handleGoogleCallback(token);
      console.log('🔍 Google Callback - Token stocké');

      this.auth.me().subscribe({
        next: (res: any) => {
          console.log('🔍 Google Callback - Réponse /me:', res);
          
          if (!res?.authenticated) {
            console.error('❌ Utilisateur non authentifié');
            this.router.navigate(['/']);
            return;
          }
          
          if (!res?.verified) {
            console.warn('⚠️ Utilisateur non vérifié - redirection vers vérification');
            this.router.navigate(['/verify-email']);
            return;
          }

          const roles = res?.user?.roles ?? res?.roles ?? [];
          const isAdmin = roles.includes('ROLE_ADMIN');
          console.log('✅ Redirection vers:', isAdmin ? 'admin' : 'dashboard');

          this.router.navigate(
            [
              {
                outlets: {
                  primary: ['app', isAdmin ? 'admin' : 'dashboard', isAdmin ? 'users' : undefined].filter(Boolean),
                  overlay: null
                }
              }
            ]
          );
        },
        error: (error) => {
          console.error('❌ Google Callback - Erreur /me:', error);
          this.router.navigate(['/']);
        }
      });

    } else {
      console.error('❌ Pas de token dans l\'URL');
      this.router.navigate(['/']);
    }
  }
}