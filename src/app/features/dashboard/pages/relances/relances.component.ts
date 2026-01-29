import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CandidatureService } from '../../../../core/services/candidature.service';
import { RelanceService } from '../../../../core/services/relance.service';
import { Candidature } from '../../models/candidature.model';
import { Relance } from '../../models/relance.model';

type FilterStatus = 'relances' | 'reponses';

@Component({
  selector: 'app-relances',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './relances.component.html',
  styleUrls: ['./relances.component.css'],
})
export class RelancesComponent implements OnInit {
  candidatures: Candidature[] = [];
  filterStatus: FilterStatus = 'relances';
  loading = false;

  constructor(
    private candidatureService: CandidatureService,
    private relanceService: RelanceService,
    private cdr: ChangeDetectorRef
  ) {}

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

  // utilisé dans le header HTML
  getPendingCount(): number {
    return this.pendingCount;
  }

  // =====================
  // FILTER
  // =====================

  get filteredCandidatures(): Candidature[] {
    // Désormais, les deux onglets affichent toutes les candidatures
    return this.candidatures;
  }

  // =====================
  // RELANCES
  // =====================

  getRelanceByRang(candidature: Candidature, rang: number): Relance | undefined {
    return candidature.relances?.find((r) => r.rang === rang);
  }

  getEtatCandidature(c: Candidature): string {
    if (c.statutReponse === 'entretien') {
      if (c.dateEntretien) {
        return `Entretien prévu le ${this.formatDate(c.dateEntretien)}${c.heureEntretien ? ' à ' + c.heureEntretien : ''}`;
      }
      return 'Entretien à planifier';
    }
    if (c.statutReponse === 'echanges') {
      return 'Échanges en cours';
    }
    if (c.statutReponse === 'negative') {
      return 'Refusé';
    }
    if (c.statutReponse === 'attente' || !c.statutReponse) {
      return 'En attente de retour';
    }
    return c.statutReponse;
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
  // UI HELPERS
  // =====================

  getProgress(candidature: Candidature): number {
    if (!candidature.relances?.length) return 0;
    const done = candidature.relances.filter((r) => r.faite).length;
    return Math.round((done / candidature.relances.length) * 100);
  }

  getDaysSince(dateStr: string): number {
    const diff =
      new Date().getTime() - new Date(dateStr).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }
}
