import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Candidature } from '../../features/dashboard/models/candidature.model';

@Injectable({ providedIn: 'root' })
export class CandidatureService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api';

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
    return this.http.get<Candidature[]>(
      'http://localhost:8080/api/my-candidatures'
    );
  }

  deleteCandidatureByIri(candidatureIri: string) {
    return this.http.delete(`http://localhost:8080${candidatureIri}`);
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
    statut: 'attente' | 'echanges' | 'negative'
  ): Observable<any> {
    // Extraction de l'ID depuis l'IRI
    const id = candidatureIri.split('/').pop();
    
    console.log('📡 API Call:', {
      url: `${this.apiUrl}/candidatures/${id}/statut-reponse`,
      body: { statutReponse: statut }
    });

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

  /**
   * @deprecated Utiliser EntretienService.createEntretien()
   */
  updateEntretien(
    candidatureId: number,
    date: string | null,
    heure: string | null
  ): Observable<any> {
    return this.http.patch<any>(
      `${this.apiUrl}/candidatures/${candidatureId}/entretien`,
      {
        dateEntretien: date,
        heureEntretien: heure
      }
    );
  }
}