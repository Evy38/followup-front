/**
 * Service de gestion des filtres de recherche d'annonces.
 *
 * Partage l'état des filtres (ville, poste) entre le composant de filtrage
 * et le composant d'affichage des annonces via un `BehaviorSubject`.
 * Tout composant peut s'abonner à `filter$` pour réagir aux changements.
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/** Critères de filtrage des annonces d'emploi. */
export interface AnnonceFilter {
  /** Ville ou code postal cible */
  ville: string;
  /** Intitulé du poste recherché */
  poste: string;
}

/**
 * Service de filtrage des annonces.
 *
 * Expose `filter$` pour la souscription réactive, `updateFilter()` pour
 * appliquer de nouveaux critères, et `reset()` pour vider les filtres.
 */
@Injectable({
  providedIn: 'root',
})
export class AnnonceFilterService {

  private readonly _filter$ = new BehaviorSubject<AnnonceFilter>({
    ville: '',
    poste: '',
  });

  /** Observable des critères de filtrage courants. */
  readonly filter$ = this._filter$.asObservable();

  /**
   * Met à jour les critères de filtrage.
   *
   * @param filter Nouveaux critères (ville et/ou poste)
   */
  updateFilter(filter: AnnonceFilter) {
    this._filter$.next(filter);
  }

  /** Remet les filtres à leur état initial (champs vides). */
  reset() {
    this._filter$.next({ ville: '', poste: '' });
  }
}
