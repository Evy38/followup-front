/**
 * Modèle d'offre d'emploi
 * 
 * @module core/models/job
 * @description Interface TypeScript pour les offres d'emploi provenant
 * d'API externes (ex: Adzuna)
 * 
 * @conformité REAC CDA - Compétence 2 : Développer des interfaces utilisateur
 */

/**
 * Représentation d'une offre d'emploi
 * 
 * @interface Job
 * @description Structure pour les offres d'emploi récupérées depuis des APIs
 * tierces (Adzuna, France Travail, etc.)
 * 
 * @example
 * ```typescript
 * const job: Job = {
 *   externalId: 'adzuna-123456',
 *   title: 'Développeur Full Stack',
 *   company: 'TechCorp',
 *   location: 'Paris, France',
 *   contractType: 'CDI',
 *   salaryMin: 35000,
 *   salaryMax: 45000,
 *   redirectUrl: 'https://example.com/job/123456',
 *   _candidated: false
 * };
 * ```
 */
export interface Job {
  /**
   * Identifiant externe unique de l'offre
   * Format : 'source-id' (ex: 'adzuna-123456')
   */
  externalId: string;

  /** Titre du poste */
  title: string;

  /** Nom de l'entreprise recruteur */
  company: string;

  /** Localisation du poste (ville, département, région) */
  location: string;

  /**
   * Type de contrat
   * Exemples : 'CDI', 'CDD', 'Freelance', 'Stage', 'Alternance'
   */
  contractType: string;

  /**
   * Salaire minimum annuel en euros (optionnel)
   * null si non renseigné dans l'annonce
   */
  salaryMin?: number | null;

  /**
   * Salaire maximum annuel en euros (optionnel)
   * null si non renseigné dans l'annonce
   */
  salaryMax?: number | null;

  /**
   * URL de redirection vers l'annonce originale
   * Permet à l'utilisateur d'accéder à l'annonce complète
   */
  redirectUrl: string;

  /**
   * Indicateur UI : l'utilisateur a-t-il déjà candidaté ?
   * Propriété calculée côté frontend, non persistée en base
   * 
   * @internal Utilisé pour désactiver le bouton "Candidater"
   */
  _candidated?: boolean;
}