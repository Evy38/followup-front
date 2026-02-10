import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidatureService } from '../../../../core/services/candidature.service';
import { Candidature } from '../../../../core/models/candidature.model';

@Component({
  selector: 'app-candidatures',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './candidatures.component.html',
  styleUrls: ['./candidatures.component.css'],
})
export class CandidaturesComponent implements OnInit {
  candidatures: Candidature[] = [];
  loading = true;
  error: string | null = null;

  // MODALE
  confirmOpen = false;
  pendingDelete: Candidature | null = null;
  deleting = false;

  constructor(
    private candidatureService: CandidatureService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;

    this.candidatureService.getMyCandidatures().subscribe({
      next: (items) => {
        // tri par date desc (optionnel mais utile)
        this.candidatures = [...items].sort((a, b) =>
          (b.dateCandidature ?? '').localeCompare(a.dateCandidature ?? '')
        );
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur API candidatures', err);
        this.error = 'Impossible de charger vos candidatures';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
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

  deleteCandidature(c: Candidature) {
    const iri = (this.pendingDelete as any)?.['@id'];
    if (!iri) return;

    // Optimiste : on retire direct de l’UI
    const backup = [...this.candidatures];
    this.candidatures = this.candidatures.filter(
      (x: any) => x['@id'] !== iri
    );

    this.candidatureService.deleteCandidatureByIri(iri).subscribe({
      error: () => {
        // rollback si erreur
        this.candidatures = backup;
      },
    });
  }

  // OUVRIR MODALE
  askDelete(c: Candidature) {
    this.pendingDelete = c;
    this.confirmOpen = true;
  }

  // FERMER MODALE
  cancelDelete() {
    if (this.deleting) return; // évite de fermer pendant suppression
    this.confirmOpen = false;
    this.pendingDelete = null;
  }

  // CONFIRMER SUPPRESSION (vraie suppression)
  confirmDelete() {
    // Utilise l'IRI si présent, sinon construit à partir de l'id
    const iri = (this.pendingDelete as any)?.['@id'] || (this.pendingDelete?.id ? `/candidatures/${this.pendingDelete.id}` : undefined);
    if (!iri) {
      return;
    }

    this.deleting = true;
    this.candidatureService.deleteCandidatureByIri(iri).subscribe({
      next: () => {
        this.deleting = false;
        this.cancelDelete();
        this.load();
        this.candidatureService.notifyRefresh();
      },
      error: () => {
        this.deleting = false;
        this.cancelDelete();
      }
    });
  }


}
