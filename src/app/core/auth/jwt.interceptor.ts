/**
 * Intercepteur JWT.
 *
 * Ajoute automatiquement le header `Authorization: Bearer <token>` sur
 * toutes les requêtes HTTP sortantes, sauf les routes publiques listées
 * dans `publicRoutes` (login, register, forgot/reset password, OAuth Google).
 *
 * Le token est lu depuis `localStorage` (clé `"token"`).
 * Si aucun token n'est présent, la requête est transmise sans modification.
 */
import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // Routes publiques qui ne nécessitent pas de token
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

  // Vérifier si la requête est vers une route publique
  const isPublicRoute = publicRoutes.some(route => req.url.includes(route));

  // N'ajouter le token que si ce n'est pas une route publique
  if (!isPublicRoute) {
    const token = typeof window !== 'undefined'
      ? localStorage.getItem('token')
      : null;


    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
  }

  return next(req);
};
