/**
 * Service de gestion du profil de l'utilisateur connecté.
 *
 * Encapsule les appels HTTP vers `/api/user/profile` pour la lecture,
 * la mise à jour et la demande de suppression du compte.
 * Réservé à l'utilisateur courant (ROLE_USER), distinct de {@link UserService}
 * qui est réservé aux administrateurs.
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

/**
 * Données modifiables du profil utilisateur.
 *
 * Tous les champs sont optionnels. Pour changer le mot de passe,
 * `currentPassword` et `newPassword` doivent être fournis ensemble.
 */
export interface UpdateProfilePayload {
  /** Nouvelle adresse email */
  email?: string;
  /** Nouveau prénom */
  firstName?: string;
  /** Nouveau nom */
  lastName?: string;
  /** Mot de passe actuel (requis pour changer le mot de passe) */
  currentPassword?: string;
  /** Nouveau mot de passe */
  newPassword?: string;
}

/**
 * Service de profil utilisateur.
 *
 * @endpoint GET    /api/user/profile  — Lecture du profil
 * @endpoint PUT    /api/user/profile  — Mise à jour du profil
 * @endpoint DELETE /api/user/profile  — Demande de suppression (soft delete)
 */
@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/user`;

  /**
   * Récupère le profil de l'utilisateur connecté.
   *
   * @returns Observable<User>
   * @endpoint GET /api/user/profile
   */
  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`);
  }

  /**
   * Met à jour le profil de l'utilisateur connecté.
   *
   * @param payload Champs à modifier (tous optionnels)
   * @returns Observable<User> Profil mis à jour
   * @endpoint PUT /api/user/profile
   */
  updateProfile(payload: UpdateProfilePayload): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/profile`, payload);
  }

  /**
   * Demande la suppression du compte (soft delete).
   *
   * Le compte est marqué comme supprimé mais les données sont conservées
   * pendant 30 jours avant la suppression définitive (via purge admin).
   *
   * @returns Observable<any>
   * @endpoint DELETE /api/user/profile
   */
  deleteProfile(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/profile`);
  }
}
