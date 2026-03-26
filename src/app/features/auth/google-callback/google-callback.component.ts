/**
 * Composant de callback OAuth Google.
 *
 * Point d'entrée de la route `/google/callback` appelée par le backend
 * après une authentification Google réussie.
 *
 * Le backend pose le cookie HttpOnly avant la redirection — aucun token dans l'URL.
 * Ce composant appelle directement `GET /api/me` pour vérifier l'état du compte.
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
      this.toast.show(`Votre compte est en cours de suppression et n'est plus accessible. Pour revenir sur cette décision, contactez notre support.`, 'error');
      this.router.navigate(['/']);
      return;
    }

    this.auth.handleGoogleCallback();

    this.auth.me().subscribe({
      next: (res: any) => {
        if (!res?.authenticated) {
          this.toast.show(`Votre compte est en cours de suppression et n'est plus accessible. Pour revenir sur cette décision, contactez notre support.`, 'error');
          this.router.navigate(['/']);
          return;
        }

        if (!res?.verified) {
          this.router.navigate(['/verify-email']);
          return;
        }

        const roles = res?.user?.roles ?? res?.roles ?? [];
        const isAdmin = roles.includes('ROLE_ADMIN');

        this.router.navigate([{
          outlets: {
            primary: ['app', isAdmin ? 'admin' : 'dashboard', isAdmin ? 'users' : undefined].filter(Boolean),
            overlay: null
          }
        }]);
      },
      error: (err) => {
        if (err.status === 403) {
          this.toast.show(`Votre compte est en cours de suppression et n'est plus accessible. Pour revenir sur cette décision, contactez notre support.`, 'error');
        }
        this.router.navigate(['/']);
      }
    });
  }
}
