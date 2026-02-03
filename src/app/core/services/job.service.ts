import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Job } from '../../features/dashboard/models/job.model';
import { environment } from '../../../environnements/environment';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private readonly API_URL = `${environment.apiUrl}/jobs`;

  constructor(private http: HttpClient) { }

  getJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(this.API_URL, { params: { ville: 'france' } });
  }
}
