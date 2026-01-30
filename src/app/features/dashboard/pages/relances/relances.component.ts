import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CandidatureService } from '../../../../core/services/candidature.service';
import { RelanceService } from '../../../../core/services/relance.service';
import { Candidature } from '../../models/candidature.model';
import { EntretienApi } from '../../models/candidature.model';
import { Relance } from '../../models/relance.model';
import { EntretienService } from '../../../../core/services/entretien.service';

type FilterStatus = 'relances' | 'reponses';

@Component({
  selector: 'app-relances',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './relances.component.html',
  styleUrls: ['./relances.component.css'],
})
export class RelancesComponent implements OnInit {
  // ...existing code...
  entretienForm = {
    date: '',
    heure: '',
  };

  getNbEntretiensPrevus(c: Candidature): number {
    return c.entretiens?.filter(e => e.statut === 'prevu').length ?? 0;
  }



  candidatures: Candidature[] = [];
  filterStatus: FilterStatus = 'relances';
  loading = false;

  // État UI pour l'onglet "Réponses employeurs"
  editingEntretienFor: string | null = null;

  constructor(
    private candidatureService: CandidatureService,
    private relanceService: RelanceService,
    private entretienService: EntretienService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadCandidatures();
  }

  // =====================
  // DATA
  // =====================

  private loadCandidatures(): void {
    this.loading = true;
    this.candidatureService.getMyCandidatures().subscribe({
      next: (data) => {
        this.candidatures = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Erreur chargement candidatures', err);
        this.loading = false;
      },
    });
  }

  // =====================
  // STATS
  // =====================

  get totalCount(): number {
    return this.candidatures.length;
  }

  get pendingCount(): number {
    return this.candidatures.filter((c) =>
      c.relances?.some((r) => !r.faite && this.isRelanceOverdue(r))
    ).length;
  }

  getPendingCount(): number {
    return this.pendingCount;
  }

  // =====================
  // FILTER
  // =====================

  get filteredCandidatures(): Candidature[] {
    return this.candidatures;
  }

  // =====================
  // RELANCES (Onglet 1)
  // =====================

  getRelanceByRang(candidature: Candidature, rang: number): Relance | undefined {
    return candidature.relances?.find((r) => r.rang === rang);
  }

  markAsDone(_: Candidature, relance: Relance): void {
    this.relanceService.markAsDone(relance.id).subscribe({
      next: (updated: Relance) => {
        relance.faite = updated.faite;
        relance.dateRealisation = updated.dateRealisation;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('❌ Erreur markAsDone', err),
    });
  }

  markAsUndone(_: Candidature, relance: Relance): void {
    this.relanceService.markAsUndone(relance.id).subscribe({
      next: (updated: Relance) => {
        relance.faite = updated.faite;
        relance.dateRealisation = updated.dateRealisation;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('❌ Erreur markAsUndone', err),
    });
  }

  isRelanceOverdue(relance: Relance): boolean {
    if (relance.faite) return false;
    return new Date(relance.dateRelance) < new Date();
  }

  // =====================
  // RÉPONSES EMPLOYEURS (Onglet 2)
  // =====================

  /**
   * Calcule l'état d'une candidature en fonction de statutReponse et entretiens
   */
  getEtatCandidature(c: Candidature): string {
    const entretiens = c.entretiens ?? [];

    // Cas sans entretien : se base sur statutReponse
    if (!entretiens.length) {
      switch (c.statutReponse) {
        case 'negative':
          return 'Refusé';
        case 'echanges':
          return 'Échanges en cours';
        case 'attente':
        default:
          return 'En attente de retour';
      }
    }

    // Cas avec entretiens : affiche le prochain prévu ou le dernier résultat
    const prochains = entretiens
      .filter(e => e.statut === 'prevu')
      .sort((a, b) =>
        `${a.dateEntretien}T${a.heureEntretien}`.localeCompare(
          `${b.dateEntretien}T${b.heureEntretien}`
        )
      );

    if (prochains.length) {
      const e = prochains[0];
      return `Entretien prévu le ${this.formatDate(e.dateEntretien)} à ${e.heureEntretien}`;
    }

    const passes = entretiens.filter(e => e.statut === 'passe');

    if (passes.some(e => e.resultat === 'positive')) {
      return 'Entretien réussi';
    }

    if (passes.some(e => e.resultat === 'negative')) {
      return 'Entretien refusé';
    }

    return 'Entretien passé – en attente de retour';
  }

  /**
   * Met à jour le statutReponse (attente / échanges / negative)
   */
  updateStatutReponse(
    candidature: Candidature,
    statut: 'attente' | 'echanges' | 'negative',
    event?: Event
  ): void {
    if (event) event.stopPropagation();

    // Fallback : si @id absent, on construit l'IRI à partir de l'id
    let iri = candidature['@id'];
    if (!iri && candidature.id) {
      iri = `/api/candidatures/${candidature.id}`;
    }
    if (!iri) {
      console.error('❌ IRI manquant pour la candidature', candidature);
      return;
    }

    // Si on clique sur le bouton déjà actif, on reset à "attente"
    const newStatut = (candidature.statutReponse === statut) ? 'attente' : statut;
    console.log('🔄 Mise à jour statut:', { iri, statut: newStatut });

    // Optimistic UI
    const previous = candidature.statutReponse;
    candidature.statutReponse = newStatut;
    this.cdr.detectChanges();

    // Utilise le bon endpoint backend
    this.candidatureService.updateStatutReponse(iri, newStatut).subscribe({
      next: () => {
        console.log('✅ Statut mis à jour avec succès');
      },
      error: (err) => {
        console.error('❌ Erreur mise à jour statut', err);
        // Rollback si erreur backend
        candidature.statutReponse = previous;
        this.cdr.detectChanges();
      },
    });
  }

  /**
   * Annule/réinitialise le statut à "attente"
   */
  resetStatutReponse(candidature: Candidature, event: Event): void {
    event.stopPropagation();
    this.updateStatutReponse(candidature, 'attente');
  }

  /**
   * Vérifie si une candidature a au moins un entretien prévu
   */
  hasEntretienPrevu(c: Candidature): boolean {
    return (c.entretiens ?? []).some(e => e.statut === 'prevu');
  }

  /**
   * Vérifie si une candidature a au moins un entretien passé avec succès
   */
  hasEntretienReussi(c: Candidature): boolean {
    return (c.entretiens ?? []).some(e => e.statut === 'passe' && e.resultat === 'positive');
  }

  /**
   * Vérifie si une candidature a au moins un entretien raté
   */
  hasEntretienRate(c: Candidature): boolean {
    return (c.entretiens ?? []).some(e => e.statut === 'passe' && e.resultat === 'negative');
  }

  /**
   * Démarre l'édition d'un entretien (affiche le mini-formulaire inline)
   */
  startEditEntretien(candidatureIri: string): void {
    this.editingEntretienFor = candidatureIri;
  }

  /**
   * Annule l'édition
   */
  cancelEditEntretien(): void {
    this.editingEntretienFor = null;
  }

  /**
   * Crée un nouvel entretien
   */
  createEntretien(c: Candidature): void {
    if (!c['@id']) return;

    console.log('🔄 Création entretien pour', c['@id']);

    this.entretienService
      .createEntretien(c['@id'], this.today(), '09:00')
      .subscribe({
        next: (e) => {
          console.log('✅ Entretien créé', e);
          c.entretiens = [...(c.entretiens ?? []), e];
          this.cancelEditEntretien(); // Ferme automatiquement le formulaire
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('❌ Erreur création entretien', err);
        }
      });
  }

  /**
   * Met à jour un entretien existant (date/heure)
   */
  updateEntretien(e: any): void {
    console.log('🔄 Mise à jour entretien', e);
    this.entretienService.updateEntretien(e['@id'], 'prevu').subscribe({
      next: () => {
        console.log('✅ Entretien mis à jour');
      },
      error: (err) => {
        console.error('❌ Erreur mise à jour entretien', err);
      }
    });
  }

  /**
   * Marque un entretien comme passé avec résultat
   */
  markEntretienAsPassed(
    e: any,
    resultat: 'positive' | 'negative'
  ): void {
    console.log('🔄 Marquage entretien comme passé', { e, resultat });
    
    this.entretienService
      .updateEntretien(e['@id'], 'passe', resultat)
      .subscribe({
        next: (updated) => {
          console.log('✅ Entretien marqué comme passé', updated);
          Object.assign(e, updated);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('❌ Erreur marquage entretien', err);
        }
      });
  }

  /**
   * Supprime un entretien
   */
  deleteEntretien(c: Candidature, entretien: any, event: Event): void {
    event.stopPropagation();
    
    if (!confirm('Supprimer cet entretien ?')) return;

    console.log('🔄 Suppression entretien', entretien['@id']);

    this.entretienService.deleteEntretien(entretien['@id']).subscribe({
      next: () => {
        console.log('✅ Entretien supprimé');
        c.entretiens = (c.entretiens ?? []).filter(e => e['@id'] !== entretien['@id']);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Erreur suppression entretien', err);
      }
    });
  }

  // =====================
  // UI HELPERS
  // =====================

  getProgress(candidature: Candidature): number {
    if (!candidature.relances?.length) return 0;
    const done = candidature.relances.filter((r) => r.faite).length;
    return Math.round((done / candidature.relances.length) * 100);
  }

  getDaysSince(dateStr: string): number {
    const diff = new Date().getTime() - new Date(dateStr).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  formatDate(iso: string): string {
    if (!iso) return '—';
    const d = new Date(iso);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(d);
  }

  private today(): string {
    return new Date().toISOString().split('T')[0];
  }
}