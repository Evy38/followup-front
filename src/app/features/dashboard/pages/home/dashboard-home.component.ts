import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { map } from 'rxjs/operators';
import { CandidatureService } from '../../../../core/services/candidature.service';
import { AuthService } from '../../../../core/auth/auth.service';
import { Candidature } from '../../../../core/models/candidature.model';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css'],
})
export class DashboardHomeComponent implements OnInit {
  candidatures: Candidature[] = [];
  loading = false;
  firstName$: any;

  constructor(
    private candidatureService: CandidatureService,
    private auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.firstName$ = this.auth.user$.pipe(map((u: any) => u?.firstName || null));
  }

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

  get recentCandidatures(): Candidature[] {
    return [...this.candidatures]
      .sort((a, b) => (b.dateCandidature ?? '').localeCompare(a.dateCandidature ?? ''))
      .slice(0, 5);
  }

  get candidaturesRelancesEnRetard(): Candidature[] {
    const now = new Date();
    return this.candidatures
      .filter(c => c.relances?.some(r => !r.faite && new Date(r.dateRelance) < now))
      .slice(0, 5);
  }

  get prochainEntretiens(): Array<{ candidature: Candidature; dateEntretien: string; heureEntretien: string }> {
    const todayStr = new Date().toISOString().split('T')[0];
    const result: Array<{ candidature: Candidature; dateEntretien: string; heureEntretien: string }> = [];
    for (const c of this.candidatures) {
      for (const e of (c.entretiens ?? [])) {
        if (e.statut === 'prevu' && e.dateEntretien >= todayStr) {
          result.push({ candidature: c, dateEntretien: e.dateEntretien, heureEntretien: e.heureEntretien });
        }
      }
    }
    return result
      .sort((a, b) => a.dateEntretien.localeCompare(b.dateEntretien))
      .slice(0, 5);
  }

  formatDate(iso: string | null | undefined): string {
    if (!iso) return '—';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '—';
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(d);
  }

  // Symfony sérialise parfois les champs Time en "1970-01-01T10:30:00+00:00"
  formatHeure(heure: string | null | undefined): string {
    if (!heure) return '—';
    if (heure.includes('T')) {
      return (heure.split('T')[1] ?? '').slice(0, 5);
    }
    return heure.slice(0, 5);
  }
}
