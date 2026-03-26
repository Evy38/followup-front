/**
 * Intercepteur credentials.
 *
 * Ajoute `withCredentials: true` sur toutes les requêtes sortantes
 * pour que le navigateur envoie automatiquement les cookies HttpOnly
 * (access_token, refresh_token) sur chaque appel API.
 */
import { HttpInterceptorFn } from '@angular/common/http';

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req.clone({ withCredentials: true }));
};
