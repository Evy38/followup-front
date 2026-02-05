import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ContractType {
  value: string;
  label: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContractTypeService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/jobs/contract-types`; 

  getContractTypes(): Observable<ContractType[]> {
    return this.http.get<ContractType[]>(this.apiUrl);
  }
}