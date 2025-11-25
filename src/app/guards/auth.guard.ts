import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // 1️⃣ Si URL contient un token (OAuth Google), laisser passer
  const tokenInUrl = route.queryParamMap.get('token');
  if (tokenInUrl) {
    return true;
  }

  // 2️⃣ Si utilisateur connecté → OK
  if (auth.isLogged()) {
    return true;
  }

  // 3️⃣ Sinon → login (sans redirection infinie)
  if (route.routeConfig?.path !== 'login') {
    router.navigate(['/login']);
  }
  return false;
};