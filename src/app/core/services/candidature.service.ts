import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Candidature } from '../../features/dashboard/models/candidature.model';
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
   * @param candidatureIri IRI de la candidature (ex: "/api/candidatures/123")
   * @param statut Nouveau statut (attente | echanges | negative)
   */
  updateStatutReponse(
    candidatureIri: string,
    statut: 'attente' | 'echanges' | 'negative' | 'engage'
  ): Observable<any> {
    // Extraction de l'ID depuis l'IRI
    const id = candidatureIri.split('/').pop();

    return this.http.patch<any>(
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