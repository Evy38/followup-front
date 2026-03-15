/**
 * Composant de callback OAuth Google.
 *
 * Point d'entrée de la route `/google/callback` appelée par le backend
 * après une authentification Google réussie.
 *
 * Traitement dans `ngOnInit()` :
 * 1. Lit le JWT depuis le query param `?token=...`
 * 2. Stocke le token via {@link AuthService.handleGoogleCallback}
 * 3. Appelle `GET /api/me` pour vérifier l'état du compte
 * 4. Redirige vers le dashboard (utilisateur) ou l'admin (ROLE_ADMIN),
 *    ou vers `/verify-email` si le compte n'est pas vérifié
 */
import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { ToastService } from '../../../core/ui/toast.service';

@Component({
  selector: 'app-google-callback',
  standalone: true,
  template: `<div class="google-callback">Connexion Google en cours...</div>`,
})
export class GoogleCallbackComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  ngOnInit(): void {
    const error = this.route.snapshot.queryParamMap.get('error');
    if (error === 'account_deleted') {
      this.auth.removeToken();
      this.toast.show(`Votre compte est en cours de suppression et n'est plus accessible. Pour revenir sur cette décision, contactez notre support.`, 'error');
      this.router.navigate(['/']);
      return;
    }

    const token = this.route.snapshot.queryParamMap.get('token');
    console.log('🔍 Google Callback - Token reçu:', token);
    
    if (token) {
      this.auth.handleGoogleCallback(token);
      console.log('🔍 Google Callback - Token stocké');

      this.auth.me().subscribe({
        next: (res: any) => {
          console.log('🔍 Google Callback - Réponse /me:', res);
          
          if (!res?.authenticated) {
            this.auth.removeToken();
            this.toast.show(`Votre compte est en cours de suppression et n'est plus accessible. Pour revenir sur cette décision, contactez notre support.`, 'error');
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
        error: (err) => {
          this.auth.removeToken();
          if (err.status === 403) {
            this.toast.show(`Votre compte est en cours de suppression et n'est plus accessible. Pour revenir sur cette décision, contactez notre support.`, 'error');
          }
          this.router.navigate(['/']);
        }
      });

    } else {
      console.error('❌ Pas de token dans l\'URL');
      this.router.navigate(['/']);
    }
  }
}