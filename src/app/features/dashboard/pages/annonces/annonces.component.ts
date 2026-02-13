import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { JobService } from '../../../../core/services/job.service';
import { Job } from '../../../../core/models/job.model';
import { CandidatureService } from '../../../../core/services/candidature.service';
import { CommonModule } from '@angular/common';
import { AnnonceFilterService } from '../../../../core/services/annonce-filter.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-annonces',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './annonces.component.html',
  styleUrls: ['./annonces.component.css'],
})
export class AnnoncesComponent implements OnInit {
  private destroy$ = new Subject<void>();
  jobs: Job[] = [];

  villes: string[] = [];
  postes: string[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private jobService: JobService,
    private candidatureService: CandidatureService,
    private cdr: ChangeDetectorRef,
    private annonceFilterService: AnnonceFilterService,
  ) { }

  ngOnInit(): void {
    this.annonceFilterService.filter$
      .pipe(takeUntil(this.destroy$))
      .subscribe((filter) => this.loadJobs(filter));

    this.candidatureService.refreshNeeded$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.loadCandidatures());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadJobs(filtre?: { ville: string; poste: string }) {
    this.loading = true;

    const cleanFilter: any = {};

    if (filtre?.ville?.trim()) {
      cleanFilter.ville = filtre.ville.trim();
    }

    if (filtre?.poste?.trim()) {
      cleanFilter.poste = filtre.poste.trim();
    }

    this.jobService.getJobs(cleanFilter).subscribe({
      next: (jobs) => {
        this.jobs = jobs;

        this.villes = Array.from(
          new Set(jobs.map((j) => j.location).filter(Boolean))
        );
        this.postes = Array.from(
          new Set(jobs.map((j) => j.title).filter(Boolean))
        );

        this.loading = false;
        this.loadCandidatures();
      },
      error: (err) => {
        console.error('Erreur API jobs:', err);
        this.error = 'Impossible de charger les annonces';
        this.loading = false;
      },
    });
  }

  /**
   * Gère la candidature à une offre
   * 
   * @conformité REAC CDA : Envoi de données structurées vers l'API
   * 
   * IMPORTANT : On ne transmet QUE les champs attendus par le backend
   * pour éviter les erreurs 400 Bad Request
   */
  onCandidated(job: Job) {
    // Vérification : déjà candidaté ?
    if (job._candidated) {
      console.warn('⚠️ Candidature déjà effectuée pour cette offre');
      return;
    }

    // Construction du payload conforme à l'API backend
    const candidaturePayload = {
      externalId: job.externalId,
      company: job.company,
      redirectUrl: job.redirectUrl,
      title: job.title,
      location: job.location,
    };

    console.log('📤 [AnnoncesComponent] Envoi candidature :', candidaturePayload);

    // Envoi de la candidature
    this.candidatureService.createFromOffer(candidaturePayload).subscribe({
      next: (response) => {
        console.log('✅ [AnnoncesComponent] Candidature créée avec succès', response);
        this.loadCandidatures(); // Rafraîchit la liste pour marquer comme "candidaté"
      },
      error: (err) => {
        console.error('❌ [AnnoncesComponent] Erreur lors de la candidature', err);

        // Affichage d'un message utilisateur (optionnel)
        if (err.status === 400) {
          console.error('Erreur 400 : Données invalides envoyées au serveur');
          console.error('Payload envoyé :', candidaturePayload);
        }
      },
    });
  }

  trackByJobId(index: number, job: Job) {
    return job.externalId;
  }

  loadCandidatures() {
    this.candidatureService.getMyCandidatures().subscribe({
      next: (candidatures) => {
        const candidatedIds = new Set(
          candidatures.map((c) => c.externalOfferId)
        );
        this.jobs = this.jobs.map((job) => ({
          ...job,
          _candidated: candidatedIds.has(job.externalId),
        }));
        this.cdr.detectChanges();
      },
    });
  }
}