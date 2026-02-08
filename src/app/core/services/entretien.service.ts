import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface EntretienApi {
  '@id': string;
  id: number;
  dateEntretien: string;
  heureEntretien: string;
  statut: 'prevu' | 'passe' | 'annule';
  resultat?: 'engage' | 'negative' | null;
}

/**
 * Service responsable de la gestion des entretiens.
 *
 * ⚠️ IMPORTANT :
 * - Aucune logique métier ici
 * - Le backend décide du statut global de la candidature
 * - Le front ne fait que déclarer des intentions
 */
@Injectable({
  providedIn: 'root',
})
export class EntretienService {
  private http = inject(HttpClient);

  private readonly API_URL = environment.apiUrl ;

  /**
   * Création d’un entretien pour une candidature.
   *
   * @param candidatureIri IRI de la candidature (/api/candidatures/110)
   * @param date Date de l’entretien (YYYY-MM-DD)
   * @param heure Heure de l’entretien (HH:mm:ss)
   */
  createEntretien(
    candidatureIri: string,
    date: string,
    heure: string
  ): Observable<EntretienApi> {
    return this.http.post<EntretienApi>(
      `${this.API_URL}/entretiens`,
      {
        candidature: candidatureIri,
        dateEntretien: date,
        heureEntretien: heure,
        statut: 'prevu',
      },
      {
        headers: {
          'Content-Type': 'application/ld+json',
        },
      }
    );
  }

  /**
   * Mise à jour d’un entretien existant.
   *
   * Cas d’usage :
   * - entretien passé
   * - résultat connu (engage / negative)
   *
   * @param entretienIri IRI de l’entretien (/api/entretiens/4)
   * @param statut Nouveau statut
   * @param resultat Résultat éventuel
   */
  updateEntretien(
    entretienIri: string,
    statut: 'prevu' | 'passe' | 'annule',
    resultat?: 'engage' | 'negative' | null
  ): Observable<EntretienApi> {
    return this.http.patch<EntretienApi>(
      `${this.API_URL}${entretienIri}`,
      {
        statut,
        resultat,
      },
      {
        headers: {
          'Content-Type': 'application/merge-patch+json',
        },
      }
    );
  }

  /**
   * @param entretienIriOrId 
   */
  deleteEntretien(entretienIri: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}${entretienIri}`);
  }

}
