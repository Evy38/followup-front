import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Candidature } from '../models/candidature.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CandidatureService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private refresh$ = new Subject<void>();
  refreshNeeded$ = this.refresh$.asObservable();

  createFromOffer(job: {
    externalId: string;
    company: string;
    redirectUrl: string;
    title?: string;
    location?: string;
  }) {
    return this.http.post(
      `${environment.apiUrl}/candidatures/from-offer`,
      {
        externalId: String(job.externalId),
        company: job.company,
        redirectUrl: job.redirectUrl,
        title: job.title ?? null,
        location: job.location ?? null,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

  }



  getMyCandidatures(): Observable<Candidature[]> {
    return this.http.get<Candidature[]>(`${this.apiUrl}/my-candidatures`);
  }

  deleteCandidatureByIri(candidatureIri: string) {
    return this.http.delete(`${this.apiUrl}${candidatureIri}`);
  }

  notifyRefresh() {
    this.refresh$.next();
  }

  /**
   * Met à jour le statutReponse d'une candidature
   * 
   */
  /**
   * Met à jour le statutReponse d'une candidature
   * Seules les valeurs acceptées par le backend sont autorisées.
   */
  updateStatutReponse(
    candidatureIri: string,
    statut: string
  ): Observable<any> {
    if (!candidatureIri) {
      throw new Error('[CandidatureService] candidatureIri manquant');
    }
    const id = candidatureIri.split('/').pop();
    if (!id) {
      throw new Error('[CandidatureService] Impossible d’extraire l’id');
    }
    // Liste stricte des statuts acceptés par le backend
    const statutsValides = ['attente', 'negative', 'echanges', 'engage'];
    if (!statutsValides.includes(statut)) {
      throw new Error(
        `[CandidatureService] Statut non autorisé: ${statut}. Autorisés: ${statutsValides.join(', ')}`
      );
    }
    return this.http.patch(
      `${this.apiUrl}/candidatures/${id}/statut-reponse`,
      { statutReponse: statut },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }



}