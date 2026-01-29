import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CandidatureService } from '../../../../core/services/candidature.service';
import { RelanceService } from '../../../../core/services/relance.service';
import { Candidature } from '../../models/candidature.model';
import { Relance } from '../../models/relance.model';

type FilterStatus = 'all' | 'pending' | 'done';

@Component({
  selector: 'app-relances',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './relances.component.html',
  styleUrls: ['./relances.component.css'],
})
export class RelancesComponent implements OnInit {
  candidatures: Candidature[] = [];
  filterStatus: FilterStatus = 'all';
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
    if (this.filterStatus === 'pending') {
      return this.candidatures.filter((c) =>
        c.relances?.some((r) => !r.faite && this.isRelanceOverdue(r))
      );
    }

    if (this.filterStatus === 'done') {
      return this.candidatures.filter(
        (c) => c.relances?.length && c.relances.every((r) => r.faite)
      );
    }

    return this.candidatures;
  }

  // =====================
  // RELANCES
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
