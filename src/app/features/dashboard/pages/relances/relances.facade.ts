import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

import { CandidatureService } from '../../../../core/services/candidature.service';
import { RelanceService } from '../../../../core/services/relance.service';
import { EntretienService } from '../../../../core/services/entretien.service';
import { ToastService } from '../../../../core/ui/toast.service';

import { Candidature } from '../../models/candidature.model';
import { Relance } from '../../models/relance.model';
import { EntretienApi } from '../../models/candidature.model';

import {
    getPendingRelancesCount,
    getTotalDoneRelances,
} from './helpers/relances.helpers';

@Injectable({ providedIn: 'root' })
export class RelancesFacade {
    private candidatureService = inject(CandidatureService);
    private relanceService = inject(RelanceService);
    private entretienService = inject(EntretienService);
    private toastService = inject(ToastService);

    private readonly candidaturesSubject =
        new BehaviorSubject<Candidature[]>([]);

    readonly candidatures$ = this.candidaturesSubject.asObservable();

    readonly stats$ = this.candidatures$.pipe(
        map((candidatures) => ({
            totalCandidatures: candidatures.length,
            pendingRelances: getPendingRelancesCount(candidatures),
            doneRelances: getTotalDoneRelances(candidatures),
        }))
    );

    // =========================
    // LOAD
    // =========================
    load(): void {
        this.candidatureService.getMyCandidatures().subscribe({
            next: (data) => this.candidaturesSubject.next(data),
            error: () =>
                this.toastService.show(
                    'Erreur lors du chargement des candidatures',
                    'error'
                ),
        });
    }

    // =========================
    // RELANCES
    // =========================
    markRelance(relance: Relance, faite: boolean): void {
        this.relanceService.updateRelance(relance.id, faite).subscribe({
            next: (updated) => {
                this.patchRelance(updated);
                this.toastService.show(
                    faite
                        ? 'Relance marquée comme effectuée'
                        : 'Relance annulée',
                    'success'
                );
            },
            error: () =>
                this.toastService.show(
                    'Erreur lors de la mise à jour de la relance',
                    'error'
                ),
        });
    }

    // =========================
    // STATUT RÉPONSE
    // =========================
    updateStatut(
        candidature: Candidature,
        statut: 'attente' | 'echanges' | 'negative' | 'engage'
    ): void {
        // ✅ Construction robuste de l'IRI
        const iri = candidature['@id'] || `/candidatures/${candidature.id}`;

        if (!iri || !candidature.id) {
            this.toastService.show(
                'Candidature invalide (identifiant manquant)',
                'error'
            );
            return;
        }

        const previous = candidature.statutReponse;
        // Liste stricte des statuts acceptés par le backend
        const statutsValides = ['attente', 'negative', 'echanges', 'engage'];
        // Si la valeur n'est pas valide, toast d'erreur immédiat
        if (!statutsValides.includes(statut)) {
            this.toastService.show(
                `Statut non autorisé: ${statut}. Autorisés: ${statutsValides.join(', ')}`,
                'error'
            );
            return;
        }
        // ✅ Logique de toggle : si déjà actif, retour à "attente"
        const nouveauStatut = (previous === statut) ? 'attente' : statut;
        // Optimistic UI
        this.patchCandidature(candidature.id, {
            statutReponse: nouveauStatut,
        });
        this.candidatureService
            .updateStatutReponse(iri, nouveauStatut)
            .subscribe({
                next: () => {
                    this.toastService.show('Statut mis à jour', 'success');
                    // Recharge la liste pour garantir la cohérence UI/backend
                    this.load();
                },
                error: (err) => {
                    // Rollback en cas d'erreur
                    this.patchCandidature(candidature.id, {
                        statutReponse: previous,
                    });
                    const errorMsg = err?.error?.message || err?.message || 'Erreur lors de la mise à jour du statut';
                    this.toastService.show(errorMsg, 'error');
                },
            });
    }

    // =========================
    // ENTRETIENS
    // =========================
    createEntretien(
        candidature: Candidature,
        date: string,
        heure: string
    ): void {
        // ✅ Construction robuste de l'IRI
        const iri = candidature['@id'] || `/api/candidatures/${candidature.id}`;

        if (!iri) {
            this.toastService.show('Candidature invalide', 'error');
            return;
        }

        this.entretienService
            .createEntretien(iri, date, heure)
            .subscribe({
                next: (entretien) => {
                    // ✅ Filtrage des entretiens valides
                    const nouveauxEntretiens = [
                        ...(candidature.entretiens ?? []),
                        entretien,
                    ]
                        .filter(e => e.statut !== 'annule')
                        .map(e => ({
                            ...e,
                            statut: e.statut as 'prevu' | 'passe',
                        }));

                    this.patchCandidature(candidature.id, {
                        entretiens: nouveauxEntretiens,
                    });

                    this.toastService.show('Entretien créé', 'success');
                },
                error: (err) => {
                    const errorMsg = err?.error?.message || 'Erreur lors de la création de l\'entretien';
                    this.toastService.show(errorMsg, 'error');
                },
            });
    }

    deleteEntretien(
        candidature: Candidature,
        entretien: EntretienApi
    ): void {
        // ✅ Essai 1 : IRI classique
        let entretienIri = entretien['@id'];

        // ✅ Essai 2 : Construction manuelle si pas d'IRI
        if (!entretienIri && entretien.id) {
            entretienIri = `/api/entretiens/${entretien.id}`;
        }

        // ❌ Si toujours pas d'identifiant, on abandonne
        if (!entretienIri) {
            console.error('❌ Pas d\'identifiant pour cet entretien:', entretien);
            this.toastService.show(
                'Impossible de supprimer cet entretien (identifiant manquant)',
                'error'
            );
            return;
        }

        this.entretienService.deleteEntretien(entretienIri).subscribe({
            next: () => {
                // ✅ Mise à jour UI : filtre par ID numérique (plus fiable)
                this.patchCandidature(candidature.id, {
                    entretiens: (candidature.entretiens ?? []).filter(
                        (e) => e.id !== entretien.id
                    ),
                });

                this.toastService.show('Entretien supprimé', 'success');
            },
            error: (err) => {
                console.error('❌ Erreur suppression backend:', err);
                this.toastService.show(
                    "Erreur lors de la suppression de l'entretien",
                    'error'
                );
            },
        });
    }

    // =========================
    // PATCH HELPERS
    // =========================
    private patchRelance(updated: Relance): void {
        this.candidaturesSubject.next(
            this.candidaturesSubject.getValue().map((c) => ({
                ...c,
                relances: c.relances.map((r) =>
                    r.id === updated.id ? updated : r
                ),
            }))
        );
    }

    private patchCandidature(
        id: number,
        patch: Partial<Candidature>
    ): void {
        this.candidaturesSubject.next(
            this.candidaturesSubject
                .getValue()
                .map((c) => (c.id === id ? { ...c, ...patch } : c))
        );
    }
}