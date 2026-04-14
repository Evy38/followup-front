/**
 * Guard de protection des routes administrateur
 *
 * @module core/guards/admin.guard
 * @description Vérifie que l'utilisateur connecté possède le rôle ROLE_ADMIN
 * avant d'autoriser l'accès aux routes /admin
 *
 * @conformité REAC CDA - Compétence 2 : Développer des interfaces utilisateur
 * - Sécurisation des interfaces
 * - Gestion des autorisations
 *
 * @security
 * - Frontend : Protection UX (améliore l'expérience utilisateur)
 * - Backend : Vraie sécurité avec #[IsGranted('ROLE_ADMIN')]
 *
 * @note La sécurité frontend n'est qu'une couche UX.
 * La vraie sécurité est gérée par le backend Symfony.
 */

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { User } from '../models/user.model';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.me().pipe(
    map((response: { authenticated: boolean; user?: User }) => {
      if (!response?.authenticated || !response?.user) {
        return redirectToDashboard(router);
      }

      const user = response.user;
      const hasAdminRole = user.roles?.includes('ROLE_ADMIN') ?? false;

      if (hasAdminRole) {
        return true;
      }

      return redirectToDashboard(router);
    }),
    catchError(() => {
      return of(redirectToDashboard(router));
    })
  );
};

/**
 * Fonction utilitaire de redirection vers le dashboard
 *
 * @private
 * @param router Instance du Router Angular
 * @returns UrlTree pour la redirection
 */
function redirectToDashboard(router: Router) {
  return router.createUrlTree(['/app/dashboard']);
}
