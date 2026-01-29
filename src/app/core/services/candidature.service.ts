import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, map } from 'rxjs';
import { Candidature } from '../../features/dashboard/models/candidature.model';

type HydraCollection<T> = {
  'hydra:member'?: T[];
  member?: T[]; // selon config, mais ta réponse montre "member"
};

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
    // candidatureIri ressemble à "/api/candidatures/15"
    return this.http.delete(`http://localhost:8080${candidatureIri}`);
  }

  notifyRefresh() {
    this.refresh$.next();
  }

  updateStatutReponse(candidatureId: number, statut: string): Observable<any> {
    return this.http.patch<any>(
      `${this.apiUrl}/candidatures/${candidatureId}/statut-reponse`,
      { statutReponse: statut }
    );
  }

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
