/**
 * Guard d'authentification.
 *
 * Protège les routes de la zone privée (`/app/**`).
 * Appelle `GET /api/me` pour vérifier que l'utilisateur est :
 * - authentifié (`authenticated: true`)
 * - et a confirmé son email (`verified: true`)
 *
 * En cas d'échec (non authentifié, non vérifié ou erreur réseau),
 * supprime le token local et redirige vers l'overlay de login.
 */
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.me().pipe(
    map((res: { authenticated: boolean; verified?: boolean }) => {
      if (!res?.authenticated || !res?.verified) {
        return redirectToLogin(router);
      }
      return true;
    }),
    catchError(() => {
      return of(redirectToLogin(router));
    })
  );
};

function redirectToLogin(router: Router) {
  return router.createUrlTree([
    { outlets: { overlay: ['login'] } }
  ]);
}
