import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CandidatureService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api';

  createFromOffer(payload: {
    externalId: string;
    company: string;
    redirectUrl: string;
    title?: string;
    location?: string;
  }): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/candidatures/from-offer`,
      payload
    );
  }

  getMyCandidatures(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/candidatures`);
  }
}
