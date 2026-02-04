import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

// Version recommandée
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      // 🔐 401 - Token invalide ou expiré
      if (error.status === 401) {
        // Déconnecter l'utilisateur et rediriger
        localStorage.removeItem('token');
        router.navigate([{ outlets: { overlay: ['login'] } }]);
      }

      // 🚫 403 - Accès refusé (permissions insuffisantes)
      if (error.status === 403) {
        router.navigate(
          [{ outlets: { overlay: ['login'] } }],
          {
            state: {
              errorMessage: error.error?.message ?? 'Accès refusé.'
            }
          }
        );
      }

      return throwError(() => error);
    })
  );
};
