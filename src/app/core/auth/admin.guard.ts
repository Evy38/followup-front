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

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('🔐 [AdminGuard] Vérification des droits administrateur');

  // Récupère les infos de l'utilisateur connecté
  return authService.me().pipe(
    map((response: { authenticated: boolean; user?: any }) => {
      // Vérifie si l'utilisateur est authentifié
      if (!response?.authenticated || !response?.user) {
        console.warn('⚠️ [AdminGuard] Utilisateur non authentifié');
        return redirectToDashboard(router);
      }

      const user = response.user;
      
      // Vérifie si l'utilisateur a le rôle ROLE_ADMIN
      const hasAdminRole = user.roles?.includes('ROLE_ADMIN') ?? false;

      if (hasAdminRole) {
        console.log('✅ [AdminGuard] Accès autorisé - ROLE_ADMIN détecté');
        return true;
      }

      // Accès refusé : redirection vers le dashboard utilisateur
      console.warn('❌ [AdminGuard] Accès refusé - ROLE_ADMIN requis');
      console.warn(`   Rôles actuels : ${user.roles?.join(', ') || 'aucun'}`);
      
      return redirectToDashboard(router);
    }),
    catchError((error) => {
      // En cas d'erreur, on refuse l'accès par sécurité
      console.error('❌ [AdminGuard] Erreur lors de la vérification:', error);
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
  console.log('↩️ [AdminGuard] Redirection vers /app/dashboard');
  return router.createUrlTree(['/app/dashboard']);
}