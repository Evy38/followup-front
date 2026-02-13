import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

export interface UpdateProfilePayload {
  email?: string;
  firstName?: string;
  lastName?: string;
  currentPassword?: string;
  newPassword?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/user`;

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`);
  }

  updateProfile(payload: UpdateProfilePayload): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/profile`, payload);
  }

  deleteProfile(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/profile`);
  }
}
