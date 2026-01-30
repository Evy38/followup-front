import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);



  if (!auth.isLogged()) {
    
    return router.createUrlTree(
      [{ outlets: { overlay: ['login'] } }]
    );
  }

  return auth.me().pipe(
    map((res: any) => {
     
      if (!res?.authenticated) {
        return router.createUrlTree(
          [{ outlets: { overlay: ['login'] } }]
        );
      }

      if (res.verified === false) {
       
        auth.setAuthError(
          'Vous devez confirmer votre email avant de continuer.'
        );
        auth.logout();
        return router.createUrlTree(
          [{ outlets: { overlay: ['login'] } }]
        );
      }

      return true;
    }),
    catchError((err) => {
      auth.logout();
      return of(
        router.createUrlTree(
          [{ outlets: { overlay: ['login'] } }]
        )
      );
    })
  );
};
