/**
 * Modèles liés aux candidatures
 * 
 * @module core/models/candidature
 * @description Interfaces TypeScript représentant les structures de données
 * des candidatures, entreprises, statuts et entretiens.
 * 
 * @conformité REAC CDA - Compétence 2 : Développer des interfaces utilisateur
 * - Documentation du code (critère de performance)
 * - Typage strict pour la sécurité et la maintenabilité
 */

import { Relance } from './relance.model';

/**
 * Représentation d'une entreprise dans l'API
 * 
 * @interface EntrepriseApi
 */
export interface EntrepriseApi {
	/** Nom de l'entreprise */
	nom: string;
}

/**
 * Représentation d'un statut de candidature dans l'API
 * 
 * @interface StatutApi
 */
export interface StatutApi {
	/** Libellé du statut (ex: "En attente", "Refusée") */
	libelle: string;
}

/**
 * Représentation d'un entretien dans l'API
 * 
 * @interface EntretienApi
 */
export interface EntretienApi {
	/** IRI unique de l'entretien (ex: "/api/entretiens/1") */
	'@id': string;

	/** Identifiant numérique */
	id: number;

	/** Date de l'entretien au format ISO 8601 (YYYY-MM-DD) */
	dateEntretien: string;

	/** Heure de l'entretien au format HH:mm:ss */
	heureEntretien: string;

	/** Statut de l'entretien */
	statut: 'prevu' | 'passe';

	/** Résultat de l'entretien (uniquement si statut = 'passe') */
	resultat?: 'engage' | 'negative' | null;

	/** Propriété UI pour gérer l'état hover (non persistée) */
	_hover?: boolean;
}

/**
 * Représentation complète d'une candidature
 * 
 * @interface Candidature
 * @description Structure principale pour gérer le suivi des candidatures
 * 
 * @example
 * ```typescript
 * const candidature: Candidature = {
 *   '@id': '/api/candidatures/42',
 *   id: 42,
 *   jobTitle: 'Développeur Full Stack',
 *   dateCandidature: '2024-01-15T10:30:00Z',
 *   entreprise: { nom: 'TechCorp' },
 *   statut: { libelle: 'En attente' },
 *   relances: [],
 *   statutReponse: 'attente',
 *   externalOfferId: 'adzuna-12345'
 * };
 * ```
 */
export interface Candidature {
	/** IRI unique de la candidature (ex: "/api/candidatures/42") */
	'@id': string;

	/** Identifiant numérique */
	id: number;

	/** Titre du poste */
	jobTitle: string;

	/** Date de candidature au format ISO 8601 */
	dateCandidature: string;

	/** Date de la dernière relance effectuée (optionnel) */
	dateDerniereRelance?: string | null;

	/** URL de l'annonce originale (optionnel) */
	lienAnnonce?: string | null;

	/** Identifiant externe de l'offre (ex: ID Adzuna) */
	externalOfferId: string;

	/** Entreprise associée à la candidature */
	entreprise: EntrepriseApi;

	/** Statut actuel de la candidature */
	statut: StatutApi;

	/** Liste des relances programmées ou effectuées */
	relances: Relance[];

	/**
	 * Statut de la réponse de l'entreprise
	 * 
	 * Valeurs possibles :
	 * - 'attente' : En attente de réponse
	 * - 'negative' : Réponse négative reçue
	 * - 'echanges' : Échanges en cours avec l'entreprise
	 * - 'entretien' : Entretien programmé ou passé
	 * - 'annule' : Candidature annulée
	 * - 'engage' : Embauche confirmée
	 */
	statutReponse?:
	| 'attente'
	| 'negative'
	| 'echanges'
	| 'entretien'
	| 'annule'
	| 'engage';

	/** Liste des entretiens programmés ou passés (optionnel) */
	entretiens?: EntretienApi[];
}