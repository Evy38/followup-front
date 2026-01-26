export interface EntrepriseApi {
  nom: string;
}

export interface StatutApi {
  libelle: string;
}

export interface Candidature {
  id?: number;
  dateCandidature: string;     // ISO
  lienAnnonce: string | null;
  externalOfferId: string | null;
  entreprise?: EntrepriseApi;
  statut?: StatutApi;
}
