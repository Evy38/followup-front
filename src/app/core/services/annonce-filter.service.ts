import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AnnonceFilter {
  ville: string;
  poste: string;
}

@Injectable({
  providedIn: 'root',
})
export class AnnonceFilterService {

  private readonly _filter$ = new BehaviorSubject<AnnonceFilter>({
    ville: '',
    poste: '',
  });

  readonly filter$ = this._filter$.asObservable();

  updateFilter(filter: AnnonceFilter) {
    this._filter$.next(filter);
  }

  reset() {
    this._filter$.next({ ville: '', poste: '' });
  }
}
