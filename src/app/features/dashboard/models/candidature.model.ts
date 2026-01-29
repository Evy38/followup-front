import { Relance } from './relance.model';

export interface EntrepriseApi {
  nom: string;
}

export interface StatutApi {
  libelle: string;
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
  statutReponse?: 'attente' | 'negative' | 'echanges' | 'entretien';
  dateEntretien?: string;
  heureEntretien?: string;
}
