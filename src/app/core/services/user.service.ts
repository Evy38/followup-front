/**
 * Service de gestion des utilisateurs (Interface Admin)
 * 
 * @module core/services/user.service
 * @description Service responsable des opérations CRUD sur les utilisateurs
 * Réservé aux administrateurs (ROLE_ADMIN)
 * 
 * @conformité REAC CDA - Compétence 2 : Développer des interfaces utilisateur
 * - Utilisation d'API REST sécurisées
 * - Gestion des erreurs HTTP
 * - Code documenté
 * 
 * @security Tous les endpoints nécessitent ROLE_ADMIN côté backend
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

/**
 * Service de gestion des utilisateurs pour l'interface admin
 * 
 * @injectable
 * @providedIn root
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/admin/users`;

  /**
   * Récupère la liste complète des utilisateurs
   *
   * @endpoint GET /api/admin/users
   * @security Nécessite ROLE_ADMIN
   * 
   * @returns Observable<User[]> Liste des utilisateurs
   * @throws HttpErrorResponse Si l'utilisateur n'a pas les droits (403)
   * 
   * @example
   * ```typescript
   * this.userService.getAllUsers().subscribe({
   *   next: (users) => console.log('Utilisateurs:', users),
   *   error: (err) => console.error('Erreur:', err)
   * });
   * ```
   */
  getAllUsers(): Observable<User[]> {
    console.log('🔍 [UserService] Récupération de la liste des utilisateurs');
    
    return this.http.get<User[]>(this.apiUrl).pipe(
      map((users) => users.map((user) => this.normalizeUser(user))),
      tap((users) => {
        console.log(`✅ [UserService] ${users.length} utilisateur(s) récupéré(s)`);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Récupère un utilisateur par son ID
   * 
   * @endpoint GET /api/admin/users/{id}
   * @security Nécessite ROLE_ADMIN
   *
   * @param id Identifiant de l'utilisateur
   * @returns Observable<User> Utilisateur trouvé
   * @throws HttpErrorResponse Si l'utilisateur n'existe pas (404)
   * 
   * @example
   * ```typescript
   * this.userService.getUserById(42).subscribe({
   *   next: (user) => console.log('Utilisateur:', user),
   *   error: (err) => console.error('Non trouvé:', err)
   * });
   * ```
   */
  getUserById(id: string): Observable<User> {
    console.log(`🔍 [UserService] Récupération de l'utilisateur ID ${id}`);
    
    return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
      map((user) => this.normalizeUser(user)),
      tap((user) => {
        console.log(`✅ [UserService] Utilisateur récupéré:`, user.email);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Met à jour un utilisateur existant
   * 
   * @endpoint PUT /api/admin/users/{id}
   * @security Nécessite ROLE_ADMIN
   * 
   * @param id Identifiant de l'utilisateur
   * @param userData Données à mettre à jour
   * @returns Observable<User> Utilisateur mis à jour
   * 
   * @example
   * ```typescript
   * this.userService.updateUser(42, {
   *   firstName: 'Jean',
   *   roles: ['ROLE_ADMIN']
   * }).subscribe({
   *   next: (user) => console.log('Mis à jour:', user),
   *   error: (err) => console.error('Erreur:', err)
   * });
   * ```
   */
  updateUser(id: string, userData: Partial<User>): Observable<User> {
    console.log(`✏️ [UserService] Mise à jour de l'utilisateur ID ${id}`, userData);
    
    return this.http.put<User>(`${this.apiUrl}/${id}`, userData).pipe(
      map((user) => this.normalizeUser(user)),
      tap((user) => {
        console.log(`✅ [UserService] Utilisateur mis à jour:`, user.email);
      }),
      catchError(this.handleError)
    );
  }

  private normalizeUser(raw: any): User {
    const consentValue = raw?.consentRgpd ?? raw?.consent_rgpd;
    const consentRgpd = this.normalizeBoolean(consentValue);
    const consentRgpdAt = raw?.consentRgpdAt ?? raw?.consent_rgpd_at ?? null;
    const deletionRequestedAt = raw?.deletionRequestedAt ?? raw?.deletion_requested_at ?? null;
    const deletedAt = raw?.deletedAt ?? raw?.deleted_at ?? null;
    const isVerified = this.normalizeBoolean(raw?.isVerified ?? raw?.is_verified ?? false);

    return {
      ...raw,
      consentRgpd,
      consentRgpdAt,
      deletionRequestedAt,
      deletedAt,
      isVerified
    } as User;
  }

  private normalizeBoolean(value: any): boolean {
    if (value === true || value === 1 || value === '1' || value === 'true') {
      return true;
    }
    if (value === false || value === 0 || value === '0' || value === 'false') {
      return false;
    }
    return !!value;
  }

  /**
   * Purge les comptes marqués comme supprimés depuis plus d'1 mois.
   *
   * Déclenche la suppression définitive (hard delete) des comptes dont
   * `deletionRequestedAt` dépasse le seuil de rétention configuré backend.
   *
   * @endpoint POST /api/admin/users/purge
   * @security Nécessite ROLE_ADMIN
   * @returns Observable<{ message: string; purged: number }> Résultat de la purge
   */
  purgeUsers(): Observable<{ message: string; purged: number }> {
    console.log('🗑️ [UserService] Purge des comptes supprimés depuis plus d\'1 mois');

    return this.http.post<{ message: string; purged: number }>(`${environment.apiUrl}/admin/users/purge`, {}).pipe(
      tap((result) => {
        console.log(`✅ [UserService] Purge effectuée: ${result.purged} compte(s) supprimé(s)`);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Supprime définitivement un utilisateur.
   *
   * @endpoint DELETE /api/admin/users/{id}
   * @security Nécessite ROLE_ADMIN
   *
   * @param id Identifiant de l'utilisateur à supprimer
   * @returns Observable<void>
   *
   * @warning Action irréversible — demander confirmation à l'utilisateur avant l'appel.
   */
  deleteUser(id: string): Observable<void> {
    console.log(`🗑️ [UserService] Suppression de l'utilisateur ID ${id}`);
    
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        console.log(`✅ [UserService] Utilisateur supprimé`);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Gestion centralisée des erreurs HTTP
   * 
   * @private
   * @param error Erreur HTTP reçue
   * @returns Observable avec message d'erreur formaté
   * 
   * @description Traite les erreurs courantes :
   * - 401 Unauthorized : Token invalide ou expiré
   * - 403 Forbidden : Droits insuffisants (pas ROLE_ADMIN)
   * - 404 Not Found : Ressource inexistante
   * - 500 Server Error : Erreur serveur
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client (réseau, etc.)
      errorMessage = `Erreur réseau : ${error.error.message}`;
      console.error('❌ [UserService] Erreur client:', error.error.message);
    } else {
      // Erreur côté serveur
      switch (error.status) {
        case 401:
          errorMessage = 'Non authentifié. Veuillez vous reconnecter.';
          console.error('❌ [UserService] 401 - Non authentifié');
          break;
        case 403:
          errorMessage = 'Accès refusé. Droits administrateur requis.';
          console.error('❌ [UserService] 403 - Accès refusé (pas ROLE_ADMIN)');
          break;
        case 404:
          errorMessage = 'Utilisateur non trouvé.';
          console.error('❌ [UserService] 404 - Ressource non trouvée');
          break;
        case 500:
          errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
          console.error('❌ [UserService] 500 - Erreur serveur');
          break;
        default:
          errorMessage = `Erreur ${error.status}: ${error.message}`;
          console.error(`❌ [UserService] Erreur ${error.status}:`, error);
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}