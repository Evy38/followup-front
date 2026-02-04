import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Relance } from '../../features/dashboard/models/relance.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RelanceService {
  private readonly apiUrl = `${environment.apiUrl}/relances`;

  constructor(private http: HttpClient) { }
  markAsDone(relanceId: number): Observable<Relance> {
    return this.http.patch<Relance>(
      `${this.apiUrl}/${relanceId}`,
      {
        faite: true,
        dateRealisation: new Date().toISOString(),
      },
      {
        headers: {
          'Content-Type': 'application/merge-patch+json'
        }
      }
    );
  }

  markAsUndone(relanceId: number): Observable<Relance> {
    return this.http.patch<Relance>(
      `${this.apiUrl}/${relanceId}`,
      {
        faite: false,
        dateRealisation: null,
      },
      {
        headers: {
          'Content-Type': 'application/merge-patch+json'
        }
      }
    );
  }

}
