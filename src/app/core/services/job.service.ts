import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Job } from '../models/job.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private readonly API_URL = `${environment.apiUrl}/jobs`;

  constructor(private http: HttpClient) { }

  getJobs(filtre?: { ville?: string; poste?: string }) {
    const params: any = {};

    if (filtre?.ville) params.ville = filtre.ville;
    if (filtre?.poste) params.poste = filtre.poste;

    return this.http.get<Job[]>(this.API_URL, { params });
  }
}