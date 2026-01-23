import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  console.log('AUTH GUARD EXECUTED');

  if (!auth.isLogged()) {
    console.log('AUTH GUARD BLOCKED (not logged)');
    return router.createUrlTree(
      [{ outlets: { overlay: ['login'] } }]
    );
  }

  return auth.me().pipe(
    map((res: any) => {
      console.log('AUTH GUARD /me response:', res);
      if (!res?.authenticated) {
        console.log('AUTH GUARD BLOCKED (not authenticated)');
        auth.logout();
        return router.createUrlTree(
          [{ outlets: { overlay: ['login'] } }]
        );
      }

      if (res.verified === false) {
        console.log('AUTH GUARD BLOCKED (not verified)');
        auth.setAuthError(
          'Vous devez confirmer votre email avant de continuer.'
        );
        auth.logout();
        return router.createUrlTree(
          [{ outlets: { overlay: ['login'] } }]
        );
      }

      console.log('AUTH GUARD ALLOWED');
      return true;
    }),
    catchError((err) => {
      console.log('AUTH GUARD BLOCKED (error)', err);
      auth.logout();
      return of(
        router.createUrlTree(
          [{ outlets: { overlay: ['login'] } }]
        )
      );
    })
  );
};
