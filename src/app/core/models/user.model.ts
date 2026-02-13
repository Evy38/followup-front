/**
 * Modèle utilisateur
 * 
 * @module core/models/user
 * @description Interfaces TypeScript pour la gestion des utilisateurs
 * 
 * @conformité REAC CDA - Compétence 2 : Développer des interfaces utilisateur
 * @conformité RGPD : Respect de la confidentialité des données personnelles
 */

/**
 * Rôles disponibles dans l'application
 * 
 * @description Énumération des rôles utilisateur pour la gestion des permissions
 * 
 * Hiérarchie des rôles :
 * - ROLE_USER : Utilisateur standard (accès dashboard)
 * - ROLE_ADMIN : Administrateur (accès dashboard + interface admin)
 */
export enum UserRole {
  /** Utilisateur standard avec accès aux fonctionnalités de base */
  USER = 'ROLE_USER',
  
  /** Administrateur avec accès complet à l'application */
  ADMIN = 'ROLE_ADMIN'
}

/**
 * Représentation complète d'un utilisateur
 * 
 * @interface User
 * @description Structure principale pour la gestion des utilisateurs
 * 
 * @conformité RGPD : Les données personnelles (email, nom, prénom)
 * sont traitées conformément au consentement RGPD de l'utilisateur
 * 
 * @example
 * ```typescript
 * const user: User = {
 *   id: 1,
 *   email: 'user@example.com',
 *   firstName: 'Jean',
 *   lastName: 'Dupont',
 *   roles: [UserRole.USER],
 *   isVerified: true,
 *   consentRgpd: true,
 *   consentRgpdAt: '2024-01-15T10:30:00Z'
 * };
 * ```
 */
export interface User {
  /** Identifiant unique de l'utilisateur */
  id: number;

  /**
   * Adresse email (identifiant de connexion)
   * 
   * @conformité RGPD : Donnée personnelle sensible
   * @format email
   * @unique
   */
  email: string;

  /**
   * Prénom de l'utilisateur (optionnel)
   * 
   * @conformité RGPD : Donnée personnelle
   */
  firstName?: string | null;

  /**
   * Nom de l'utilisateur (optionnel)
   * 
   * @conformité RGPD : Donnée personnelle
   */
  lastName?: string | null;

  /**
   * Identifiant Google OAuth (optionnel)
   * 
   * Renseigné uniquement si l'utilisateur s'est inscrit via Google
   * 
   * @internal Utilisé pour différencier les utilisateurs OAuth
   */
  googleId?: string | null;

  /**
   * Rôles de l'utilisateur
   * 
   * Tableau contenant au minimum ROLE_USER
   * Peut contenir ROLE_ADMIN pour les administrateurs
   * 
   * @see UserRole
   */
  roles: string[];

  /**
   * Statut de vérification de l'email
   * 
   * - true : Email vérifié (utilisateur peut se connecter)
   * - false : Email non vérifié (accès limité)
   * 
   * @security L'accès à l'application nécessite isVerified = true
   */
  isVerified: boolean;

  /**
   * Consentement RGPD
   * 
   * - true : L'utilisateur a accepté les conditions RGPD
   * - false : L'utilisateur n'a pas encore donné son consentement
   * 
   * @conformité RGPD : Requis pour le traitement des données personnelles
   */
  consentRgpd: boolean;

  /**
   * Date du consentement RGPD au format ISO 8601
   * 
   * Renseigné lorsque l'utilisateur accepte les conditions RGPD
   * 
   * @conformité RGPD : Traçabilité du consentement
   */
  consentRgpdAt?: string | null;

  /**
   * Date de demande de suppression (soft delete)
   * 
   * - null : Compte actif
   * - string ISO : Demande de suppression en attente
   * 
   * @conformité RGPD : Souhait de l'utilisateur de supprimer son compte
   * @description L'admin peut voir ces utilisateurs et confirmer la suppression
   */
  deletionRequestedAt?: string | null;

  /**
   * Date de suppression confirmée (hard delete)
   * 
   * - null : Compte non supprimé
   * - string ISO : Compte supprimé définitivement
   * 
   * @description Rempli quand l'admin confirme la suppression
   */
  deletedAt?: string | null;

  /**
   * OAuth flag si l'utilisateur s'est connecté via OAuth
   */
  isOAuth?: boolean;
}

/**
 * Payload pour la création d'un utilisateur (inscription)
 * 
 * @interface CreateUserPayload
 * @description Données requises pour créer un compte utilisateur
 */
export interface CreateUserPayload {
  /** Adresse email */
  email: string;
  
  /** Mot de passe (minimum 8 caractères) */
  password: string;
  
  /** Prénom */
  firstName: string;
  
  /** Nom */
  lastName: string;
  
  /** Consentement RGPD obligatoire */
  consentRgpd: boolean;
}

/**
 * Payload pour la mise à jour d'un utilisateur
 * 
 * @interface UpdateUserPayload
 * @description Données modifiables par un administrateur
 * Tous les champs sont optionnels
 */
export interface UpdateUserPayload {
  /** Nouvelle adresse email */
  email?: string;
  
  /** Nouveau prénom */
  firstName?: string;
  
  /** Nouveau nom */
  lastName?: string;
  
  /** Nouveaux rôles */
  roles?: string[];
  
  /** Nouveau statut de vérification */
  isVerified?: boolean;
}

/**
 * Réponse API pour la liste des utilisateurs
 * 
 * @interface UsersListResponse
 * @description Format de réponse paginée pour la liste utilisateurs
 */
export interface UsersListResponse {
  /** Liste des utilisateurs */
  users: User[];
  
  /** Nombre total d'utilisateurs */
  total: number;
}