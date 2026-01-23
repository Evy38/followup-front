import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      // 🔐 401 — non authentifié
      if (error.status === 401) {
        router.navigate([{ outlets: { overlay: ['login'] } }]);
      }

      // 🚫 403 — authentifié mais interdit (email non vérifié)
      if (error.status === 403) {
        router.navigate(
          [{ outlets: { overlay: ['login'] } }],
          {
            state: {
              errorMessage:
                error.error?.message ??
                'Votre compte n’est pas encore confirmé.'
            }
          }
        );
      }

      return throwError(() => error);
    })
  );
};
