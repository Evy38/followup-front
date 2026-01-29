// relances.component.ts - VERSION CORRIGÉE
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidatureService } from '../../../../core/services/candidature.service';
import { Candidature } from '../../models/candidature.model';
import { RelanceService } from '../../../../core/services/relance.service';


@Component({
  selector: 'app-relances',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './relances.component.html',
  styleUrls: ['./relances.component.css'],
})
export class RelancesComponent implements OnInit {
  candidatures: Candidature[] = [];
  loading = true;

  // Filtres pour faciliter la navigation
  filterStatus: 'all' | 'pending' | 'done' = 'all';

  constructor(
    private candidatureService: CandidatureService,
    private cdr: ChangeDetectorRef,
    private relanceService: RelanceService,
  ) { }

  ngOnInit(): void {
    this.candidatureService.getMyCandidatures().subscribe({
      next: (data) => {
        this.candidatures = data.sort((a, b) => {
          const aPending = this.hasPendingRelances(a);
          const bPending = this.hasPendingRelances(b);
          if (aPending && !bPending) return -1;
          if (!aPending && bPending) return 1;
          return new Date(b.dateCandidature).getTime() - new Date(a.dateCandidature).getTime();
        });
        // LOG pour debug : voir si les relances sont bien à jour
        console.log('Candidatures chargées:', this.candidatures.map(c => ({
          id: c.id,
          relances: c.relances
        })));
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur API candidatures', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

markAsDone(relance: any) {
  this.relanceService.markAsDone(relance.id).subscribe({
    next: (updatedRelance: any) => {
      relance.faite = true;
      relance.dateRealisation = updatedRelance.dateRealisation;

      // Trouver la candidature parente et mettre à jour dateDerniereRelance
      const parentCandidature = this.candidatures.find(c => c.relances?.some((r: any) => r.id === relance.id));
      if (parentCandidature) {
        parentCandidature.dateDerniereRelance = updatedRelance.dateRealisation;
      }

      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Erreur lors de la relance', err);
    }
  });
}



  getRelanceByRang(candidature: any, rang: number) {
    return candidature.relances?.find((r: any) => r.rang === rang);
  }

  // Nouvelles fonctions utilitaires
  hasPendingRelances(candidature: any): boolean {
    return candidature.relances?.some((r: any) => !r.faite && this.isRelanceOverdue(r)) || false;
  }

  isRelanceOverdue(relance: any): boolean {
    if (relance.faite) return false;
    return new Date(relance.dateRelance) <= new Date();
  }

  getNextRelance(candidature: any) {
    return candidature.relances
      ?.filter((r: any) => !r.faite)
      .sort((a: any, b: any) => a.rang - b.rang)[0];
  }

  getProgress(candidature: any): number {
    const total = candidature.relances?.length || 0;
    const done = candidature.relances?.filter((r: any) => r.faite).length || 0;
    return total > 0 ? (done / total) * 100 : 0;
  }

  getDaysSince(date: string): number {
    const diff = new Date().getTime() - new Date(date).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  get filteredCandidatures(): Candidature[] {
    if (this.filterStatus === 'pending') {
      return this.candidatures.filter((c: Candidature) => this.hasPendingRelances(c));
    }
    if (this.filterStatus === 'done') {
      return this.candidatures.filter((c: Candidature) =>
        c.relances?.every((r: any) => r.faite) || false
      );
    }
    return this.candidatures;
  }

  // Méthode pour compter les candidatures à relancer (pour les stats)
  getPendingCount(): number {
    return this.candidatures.filter((c: Candidature) => this.hasPendingRelances(c)).length;
  }
}