/**
 * Service de gestion des candidatures.
 *
 * Centralise les appels HTTP vers l'API candidatures :
 * - Création depuis une offre externe (Adzuna) — idempotent (200 si existante, 201 si nouvelle)
 * - Récupération de la liste de l'utilisateur connecté
 * - Suppression d'une candidature par son IRI
 * - Mise à jour du statut de réponse (`attente`, `echanges`, `entretien`, `negative`, `engage`, `annule`)
 *
 * Expose `refreshNeeded$` (Subject) pour notifier les composants
 * qu'un rechargement de données est nécessaire après une mutation.
 *
 * @see RelancesFacade — Façade principale qui orchestre ce service
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Candidature } from '../models/candidature.model';
import { environment } from '../../../environments/environment';

/**
 * Payload requis pour créer une candidature depuis une offre externe
 * 
 * @conformité Backend : POST /api/candidatures/from-offer
 */
export interface CreateCandidatureFromOfferPayload {
  /** Identifiant externe de l'offre (obligatoire) */
  externalId: string;

  /** Nom de l'entreprise (obligatoire) */
  company: string;

  /** URL de redirection vers l'annonce (obligatoire) */
  redirectUrl: string;

  /** Titre du poste (optionnel) */
  title?: string | null;

  /** Localisation du poste (optionnel) */
  location?: string | null;
}

@Injectable({ providedIn: 'root' })
export class CandidatureService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Observable pour notifier les composants d'un refresh nécessaire
  private refresh$ = new Subject<void>();
  refreshNeeded$ = this.refresh$.asObservable();

  /**
   * Crée une candidature à partir d'une offre externe
   * 
   * @conformité REAC CDA : Interaction avec API REST
   * @endpoint POST /api/candidatures/from-offer
   * 
   * @param payload Données de l'offre (externalId, company, redirectUrl requis)
   * @returns Observable<Candidature> La candidature créée ou existante
   * 
   * @example
   * ```typescript
   * this.candidatureService.createFromOffer({
   *   externalId: 'adzuna-123',
   *   company: 'TechCorp',
   *   redirectUrl: 'https://example.com/job/123',
   *   title: 'Développeur',
   *   location: 'Paris'
   * }).subscribe({
   *   next: (candidature) => console.log('Créée:', candidature),
   *   error: (err) => console.error('Erreur:', err)
   * });
   * ```
   */
  createFromOffer(payload: CreateCandidatureFromOfferPayload): Observable<any> {
    console.log('📤 [CandidatureService] Création candidature depuis offre');
    console.log('   Payload envoyé:', payload);

    // Validation côté client (sécurité supplémentaire)
    if (!payload.externalId || !payload.company || !payload.redirectUrl) {
      const error = new Error('Champs obligatoires manquants : externalId, company, redirectUrl');
      console.error('❌ [CandidatureService] Validation échouée:', error);
      throw error;
    }

    // Construction du payload strictement conforme au backend
    const cleanPayload: CreateCandidatureFromOfferPayload = {
      externalId: String(payload.externalId).trim(),
      company: String(payload.company).trim(),
      redirectUrl: String(payload.redirectUrl).trim(),
      title: payload.title ? String(payload.title).trim() : null,
      location: payload.location ? String(payload.location).trim() : null,
    };

    return this.http.post<any>(
      `${this.apiUrl}/candidatures/from-offer`,
      cleanPayload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    ).pipe(
      tap((response) => {
        console.log('✅ [CandidatureService] Candidature créée avec succès');
        console.log('   Réponse serveur:', response);
      }),
      catchError((error) => {
        console.error('❌ [CandidatureService] Erreur lors de la création');
        console.error('   Status:', error.status);
        console.error('   Message:', error.error?.message || error.message);
        console.error('   Payload envoyé:', cleanPayload);
        throw error; // Re-throw pour que le composant puisse gérer l'erreur
      })
    );
  }

  /**
   * Récupère la liste des candidatures de l'utilisateur connecté
   * 
   * @endpoint GET /api/my-candidatures
   * @returns Observable<Candidature[]> Liste des candidatures
   */
  getMyCandidatures(): Observable<Candidature[]> {
    console.log('🔍 [CandidatureService] Récupération des candidatures');

    return this.http.get<Candidature[]>(`${this.apiUrl}/my-candidatures`).pipe(
      tap((candidatures) => {
        console.log(`✅ [CandidatureService] ${candidatures.length} candidature(s) récupérée(s)`);
      })
    );
  }

  /**
   * Supprime une candidature par son IRI
   * 
   * @endpoint DELETE /api/candidatures/{id}
   * @param candidatureIri IRI de la candidature (ex: "/api/candidatures/42")
   * @returns Observable<void>
   */
  deleteCandidatureByIri(candidatureIri: string): Observable<void> {
    console.log('🗑️ [CandidatureService] Suppression candidature:', candidatureIri);

    return this.http.delete<void>(`${this.apiUrl}${candidatureIri}`).pipe(
      tap(() => {
        console.log('✅ [CandidatureService] Candidature supprimée');
      })
    );
  }

  /**
   * Notifie les composants qu'un refresh est nécessaire
   * 
   * Utilisé après une création/modification/suppression
   * pour mettre à jour les listes affichées
   */
  notifyRefresh(): void {
    console.log('🔄 [CandidatureService] Notification refresh');
    this.refresh$.next();
  }

  /**
   * Met à jour le statut de réponse d'une candidature
   * 
   * @conformité Backend : PATCH /api/candidatures/{id}/statut-reponse
   * @endpoint PATCH /api/candidatures/{id}/statut-reponse
   * 
   * @param candidatureIri IRI de la candidature (ex: "/api/candidatures/42")
   * @param statut Nouveau statut ('attente', 'echanges', 'entretien', 'negative', 'engage', 'annule')
   * @returns Observable<any>
   * 
   * @throws Error si l'IRI est invalide ou le statut non autorisé
   */
  updateStatutReponse(candidatureIri: string, statut: string): Observable<any> {
    // Validation de l'IRI
    if (!candidatureIri) {
      throw new Error('[CandidatureService] candidatureIri manquant');
    }

    // Extraction de l'ID depuis l'IRI
    const id = candidatureIri.split('/').pop();
    if (!id) {
      throw new Error('[CandidatureService] Impossible d\'extraire l\'ID depuis l\'IRI');
    }

    // Liste stricte des statuts acceptés par le backend
    const statutsValides = ['attente', 'echanges', 'entretien', 'negative', 'engage', 'annule'];
    if (!statutsValides.includes(statut)) {
      throw new Error(
        `[CandidatureService] Statut non autorisé: "${statut}". ` +
        `Autorisés: ${statutsValides.join(', ')}`
      );
    }

    console.log(`✏️ [CandidatureService] Mise à jour statut candidature #${id}:`, statut);

    return this.http.patch<any>(
      `${this.apiUrl}/candidatures/${id}/statut-reponse`,
      { statutReponse: statut },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    ).pipe(
      tap((response) => {
        console.log('✅ [CandidatureService] Statut mis à jour avec succès');
        console.log('   Réponse:', response);
      }),
      catchError((error) => {
        console.error('❌ [CandidatureService] Erreur mise à jour statut');
        console.error('   ID candidature:', id);
        console.error('   Statut demandé:', statut);
        console.error('   Erreur:', error.error?.message || error.message);
        throw error;
      })
    );
  }
}