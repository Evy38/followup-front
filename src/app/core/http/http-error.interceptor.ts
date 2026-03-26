/**
 * Intercepteur de gestion globale des erreurs HTTP.
 *
 * Intercepte toutes les réponses en erreur sur les routes protégées :
 * - **401 — compte supprimé** : toast + suppression token + redirection login
 * - **401 — email non vérifié** : laissé aux composants (login, google-callback)
 * - **401 — session expirée / token invalide** : suppression token + redirection login
 * - **403** : redirection login avec le message d'erreur
 *
 * Toutes les erreurs sont re-propagées via `throwError()` pour que les composants
 * puissent gérer leurs propres cas d'erreur spécifiques.
 */
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../ui/toast.service';
import { catchError, throwError } from 'rxjs';

const publicRoutes = [
  '/api/login_check',
  '/api/register',
  '/api/password/request',
  '/api/password/reset',
  '/api/verify-email',
  '/auth/google',
  '/auth/google/callback',
  '/google/calback',
];

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toast = inject(ToastService);

  const isPublicRoute = publicRoutes.some(route => req.url.includes(route));

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {

      if (err.status === 401 && !isPublicRoute) {
        const msg: string = err.error?.message ?? err.error?.error ?? err.error?.detail ?? '';

        if (msg.toLowerCase().includes('supprimé')) {
          toast.show(`Votre compte est en cours de suppression et n'est plus accessible. Pour revenir sur cette décision, contactez notre support.`, 'error');
          router.navigate([{ outlets: { primary: '', overlay: 'login' } }]);
        } else if (msg.toLowerCase().includes('vérifié') || msg.toLowerCase().includes('verifié')) {
          // laissé aux composants (login, google-callback)
        } else {
          // session expirée ou token invalide
          router.navigate([{ outlets: { primary: '', overlay: 'login' } }]);
        }
      }

      if (err.status === 403 && !isPublicRoute) {
        router.navigate(
          [{ outlets: { overlay: ['login'] } }],
          { state: { errorMessage: err.error?.message ?? 'Accès refusé.' } }
        );
      }

      return throwError(() => err);
    })
  );
};
