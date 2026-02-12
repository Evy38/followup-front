import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.me().pipe(
    map((res: { authenticated: boolean; verified: boolean }) => {
      if (!res?.authenticated || !res?.verified) // verifie si l'user est authentifié/vérifié
 {
        auth.removeToken();  //si echec 
        return redirectToLogin(router);
      }
      return true;
    }),
    catchError(() => {
      auth.removeToken();
      return of(redirectToLogin(router));
    })
  );
};

//ok  Fonction utilitaire simple et claire
function redirectToLogin(router: Router) {
  return router.createUrlTree([
    { outlets: { overlay: ['login'] } }
  ]);
}
