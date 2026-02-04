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

  private readonly API_URL = environment.baseUrl;

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
      `${this.API_URL}/api/entretiens`,
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
   * Suppression d’un entretien.
   *
   * ⚠️ Le backend recalculera automatiquement
   * le statut global de la candidature si nécessaire.
   *
   * @param entretienIriOrId IRI de l’entretien (ex: /api/entretiens/42) ou ID numérique (ex: 42)
   */
  deleteEntretien(entretienIriOrId: string | number): Observable<void> {
    // Si c’est un nombre, on construit l’IRI attendu par l’API
    let iri: string;
    if (typeof entretienIriOrId === 'number') {
      iri = `/api/entretiens/${entretienIriOrId}`;
    } else if (/^\/api\/entretiens\//.test(entretienIriOrId)) {
      iri = entretienIriOrId;
    } else if (/^\/api\/candidatures\//.test(entretienIriOrId)) {
      // Cas d'une mauvaise IRI, on tente d'extraire l'id numérique à la fin
      const match = entretienIriOrId.match(/([0-9]+)$/);
      iri = match ? `/api/entretiens/${match[1]}` : entretienIriOrId;
    } else {
      iri = entretienIriOrId;
    }
    return this.http.delete<void>(
      `${this.API_URL}${iri}`
    );
  }
}
