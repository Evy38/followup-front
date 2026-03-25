/**
 * Service de gestion des relances.
 *
 * Fournit les opérations HTTP sur les relances de candidature.
 * Utilise `PATCH` avec `Content-Type: application/merge-patch+json`
 * conformément à la spécification API Platform.
 *
 * Appelé depuis {@link RelancesFacade}.
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Relance } from '../models/relance.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RelanceService {
  private readonly apiUrl = `${environment.apiUrl}/relances`;

  constructor(private http: HttpClient) { }

  /**
   * Met à jour l'état d'une relance.
   *
   * Si `faite = true`, `dateRealisation` est renseignée avec la date/heure courante.
   * Si `faite = false`, `dateRealisation` est remise à `null`.
   *
   * @param relanceId Identifiant de la relance
   * @param faite     `true` pour marquer comme effectuée, `false` pour annuler
   * @returns Observable<Relance> La relance mise à jour
   *
   * @endpoint PATCH /api/relances/{id}
   */
  updateRelance(relanceId: string, faite: boolean) {
    return this.http.patch<Relance>(
      `${this.apiUrl}/${relanceId}`,
      {
        faite,
        dateRealisation: faite ? new Date().toISOString() : null,
      },
      {
        headers: {
          'Content-Type': 'application/merge-patch+json',
        },
      }
    );
  }


}
