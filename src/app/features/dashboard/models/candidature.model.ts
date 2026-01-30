import { Relance } from './relance.model';

export interface EntrepriseApi {
  nom: string;
}

export interface StatutApi {
  libelle: string;
}

export interface EntretienApi {
  '@id': string;
  id: number;
  dateEntretien: string;
  heureEntretien: string;
  statut: 'prevu' | 'passe' | 'annule';
  resultat?: 'positive' | 'negative' | null;
  _hover?: boolean;
}

export interface Candidature {
  '@id': string;
  id: number;
  jobTitle: string;
  dateCandidature: string;
  dateDerniereRelance?: string | null;
  lienAnnonce?: string | null;
  externalOfferId: string;
  entreprise: EntrepriseApi;
  statut: StatutApi;
  relances: Relance[];
  statutReponse?:
  | 'attente'
  | 'negative'
  | 'echanges'
  | 'entretien'
  | 'positive'
  | 'annule';

  /**
 * @deprecated Utiliser `entretiens[]`
 */
  dateEntretien?: string;
  /**
   * @deprecated Utiliser `entretiens[]`
   */
  heureEntretien?: string;
  entretiens?: EntretienApi[];

}



