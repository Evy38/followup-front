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
import { catchError, map } from 'rxjs/operators';
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
   *   next: (users) => this.users = users,
   *   error: (err) => this.error = err.message
   * });
   * ```
   */
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}?filter=all_with_deleted`).pipe(
      map((users) => users.map((user) => this.normalizeUser(user))),
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
   */
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
      map((user) => this.normalizeUser(user)),
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
   */
  updateUser(id: string, userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, userData).pipe(
      map((user) => this.normalizeUser(user)),
      catchError(this.handleError)
    );
  }

  private normalizeUser(raw: User): User {
    const r = raw as unknown as Record<string, unknown>;
    const consentValue = r?.['consentRgpd'] ?? r?.['consent_rgpd'];
    const consentRgpd = this.normalizeBoolean(consentValue);
    const consentRgpdAt = r?.['consentRgpdAt'] ?? r?.['consent_rgpd_at'] ?? null;
    const deletionRequestedAt = r?.['deletionRequestedAt'] ?? r?.['deletion_requested_at'] ?? null;
    const deletedAt = r?.['deletedAt'] ?? r?.['deleted_at'] ?? null;
    const isVerified = this.normalizeBoolean(r?.['isVerified'] ?? r?.['is_verified'] ?? false);

    return {
      ...raw,
      consentRgpd,
      consentRgpdAt,
      deletionRequestedAt,
      deletedAt,
      isVerified
    } as User;
  }

  private normalizeBoolean(value: unknown): boolean {
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
    return this.http.post<{ message: string; purged: number }>(`${environment.apiUrl}/admin/users/purge`, {}).pipe(
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
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Gestion centralisée des erreurs HTTP
   *
   * @private
   * @param error Erreur HTTP reçue
   * @returns Observable avec message d'erreur formaté
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur réseau : ${error.error.message}`;
    } else {
      switch (error.status) {
        case 401:
          errorMessage = 'Non authentifié. Veuillez vous reconnecter.';
          break;
        case 403:
          errorMessage = 'Accès refusé. Droits administrateur requis.';
          break;
        case 404:
          errorMessage = 'Utilisateur non trouvé.';
          break;
        case 500:
          errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
          break;
        default:
          errorMessage = `Erreur ${error.status}: ${error.message}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
