import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // 1) Pas de token local -> pas d'accès
  if (!auth.isLogged()) {
    router.navigate([{ outlets: { overlay: ['login'] } }]);
    return false;
  }

  // 2) Token présent -> on le valide côté serveur
  return auth.me().pipe(
    map((user: any) => {
      if (user && user.isVerified === false) {
        auth.logout();
        auth.setAuthError('Vous devez confirmer votre email, cliquez ici pour recevoir un nouveau mail de confirmation.');
        router.navigate([{ outlets: { overlay: ['login'] } }]);
        return false;
      }
      return true;
    }),
    catchError((err) => {
      auth.logout();
      const message =
        err?.error?.detail ||
        err?.error?.message ||
        'Compte non confirmé. Vérifiez votre email.';
      auth.setAuthError(message);
      router.navigate([{ outlets: { overlay: ['login'] } }]);
      return of(false);
    })
  );
};