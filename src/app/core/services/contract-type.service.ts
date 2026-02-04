import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ContractType {
  value: string;
  label: string;
}

@Injectable({ providedIn: 'root' })
export class ContractTypeService {
  constructor(private http: HttpClient) {}

  getContractTypes(): Observable<ContractType[]> {
    return this.http.get<ContractType[]>('/api/contract-types');
  }
}
