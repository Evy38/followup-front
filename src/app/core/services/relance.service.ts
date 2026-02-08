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
  updateRelance(relanceId: number, faite: boolean) {
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
