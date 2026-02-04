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
  '/auth/google/callback'
  ];

  // Vérifier si la requête est vers une route publique
  const isPublicRoute = publicRoutes.some(route => req.url.includes(route));

  // N'ajouter le token que si ce n'est pas une route publique
  if (!isPublicRoute) {
    const token = localStorage.getItem('token');

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
