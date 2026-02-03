import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Candidature } from '../../features/dashboard/models/candidature.model';
import { environment } from '../../../environnements/environment';

@Injectable({ providedIn: 'root' })
export class CandidatureService {
  private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;
  private baseUrl = environment.baseUrl;

  private refresh$ = new Subject<void>();
  refreshNeeded$ = this.refresh$.asObservable();

  createFromOffer(payload: {
    externalId: string;
    company: string;
    redirectUrl: string;
    title?: string;
    location?: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/candidatures/from-offer`, payload);
  }

  getMyCandidatures(): Observable<Candidature[]> {
    return this.http.get<Candidature[]>(`${this.baseUrl}/api/my-candidatures`);
  }

  deleteCandidatureByIri(candidatureIri: string) {
    return this.http.delete(`${this.baseUrl}${candidatureIri}`);
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