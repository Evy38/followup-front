/**
 * Intercepteur de gestion globale des erreurs HTTP.
 *
 * Intercepte toutes les réponses en erreur et applique des actions centralisées :
 * - **401 Unauthorized** : Supprime le token JWT du localStorage et redirige
 *   vers l'overlay de login (token invalide ou expiré).
 * - **403 Forbidden** : Redirige vers l'overlay de login avec le message d'erreur
 *   retourné par le backend dans `state.errorMessage`.
 *
 * Toutes les erreurs sont re-propagées via `throwError()` pour que les composants
 * puissent gérer leurs propres cas d'erreur spécifiques.
 */
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

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
