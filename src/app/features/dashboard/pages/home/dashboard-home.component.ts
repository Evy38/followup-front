
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CandidatureService } from '../../../../core/services/candidature.service';
import { Candidature } from '../../models/candidature.model';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css'],
})
export class DashboardHomeComponent implements OnInit {
  candidatures: Candidature[] = [];
  loading = false;

  constructor(
    private candidatureService: CandidatureService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCandidatures();
  }

  private loadCandidatures(): void {
    this.loading = true;
    this.candidatureService.getMyCandidatures().subscribe({
      next: (data) => {
        this.candidatures = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement candidatures', err);
        this.loading = false;
      },
    });
  }

  get totalCandidatures(): number {
    return this.candidatures.length;
  }

  get relancesEffectuees(): number {
    return this.candidatures.reduce((acc, c) => acc + (c.relances?.filter(r => r.faite).length ?? 0), 0);
  }

  get relancesAFaire(): number {
    return this.candidatures.filter((c) =>
      c.relances?.some((r) => !r.faite && new Date(r.dateRelance) < new Date())
    ).length;
  }

  get entretiensPrevus(): number {
    return this.candidatures.reduce((acc, c) => acc + (c.entretiens?.filter(e => e.statut === 'prevu').length ?? 0), 0);
  }

  get retoursPositifs(): number {
    return this.candidatures.filter((c) =>
      (c.entretiens ?? []).some(e => e.statut === 'passe' && e.resultat === 'engage')
      || c.statutReponse === 'engage'
    ).length;
  }

  get retoursNegatifs(): number {
    return this.candidatures.filter((c) =>
      (c.entretiens ?? []).some(e => e.statut === 'passe' && e.resultat === 'negative') || c.statutReponse === 'negative'
    ).length;
  }
}
