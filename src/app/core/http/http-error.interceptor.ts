import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      const isCandidatureRequest = req.url.includes('/api/candidatures');

      // 🔐 401
      if (error.status === 401 && !isCandidatureRequest) {
        router.navigate([{ outlets: { overlay: ['login'] } }]);
      }

      // 🚫 403
      if (error.status === 403 && !isCandidatureRequest) {
        router.navigate(
          [{ outlets: { overlay: ['login'] } }],
          {
            state: {
              errorMessage:
                error.error?.message ??
                'Votre compte n’est pas autorisé.'
            }
          }
        );
      }

      return throwError(() => error);
    })
  );
};

