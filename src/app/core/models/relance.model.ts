/**
 * Modèle de relance
 * 
 * @module core/models/relance
 * @description Interface TypeScript pour la gestion des relances
 * de candidatures
 * 
 * @conformité REAC CDA - Compétence 2 : Développer des interfaces utilisateur
 */

/**
 * Représentation d'une relance de candidature
 * 
 * @interface Relance
 * @description Structure pour gérer les relances programmées ou effectuées
 * auprès des entreprises
 * 
 * Une relance est une action planifiée pour recontacter une entreprise
 * après l'envoi d'une candidature.
 * 
 * @example
 * ```typescript
 * const relance: Relance = {
 *   id: 1,
 *   rang: 1,
 *   dateRelance: '2024-02-15',
 *   faite: false,
 *   dateRealisation: null
 * };
 * ```
 */
export interface Relance {
  /** Identifiant unique de la relance */
  id: number;

  /**
   * Rang de la relance (ordre chronologique)
   * 
   * Exemples :
   * - 1 : Première relance (J+7 après candidature)
   * - 2 : Deuxième relance (J+14)
   * - 3 : Troisième relance (J+21)
   * 
   * @minimum 1
   * @maximum 10
   */
  rang: number;

  /**
   * Date planifiée de la relance au format ISO 8601 (YYYY-MM-DD)
   * 
   * Cette date est calculée automatiquement lors de la création
   * de la candidature ou peut être modifiée manuellement
   */
  dateRelance: string;

  /**
   * Indicateur : la relance a-t-elle été effectuée ?
   * 
   * - true : La relance a été faite (dateRealisation renseignée)
   * - false : La relance est à faire
   */
  faite: boolean;

  /**
   * Date effective de réalisation de la relance (optionnel)
   * 
   * Renseigné automatiquement lorsque l'utilisateur marque
   * la relance comme "faite"
   * 
   * Format ISO 8601 avec timestamp (YYYY-MM-DDTHH:mm:ssZ)
   */
  dateRealisation?: string | null;
}