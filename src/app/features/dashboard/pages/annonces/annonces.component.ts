/**
 * Composant de la page Annonces.
 *
 * Affiche les offres d'emploi récupérées depuis l'API Adzuna (via {@link JobService})
 * avec pagination infinie ("Voir plus") et filtrage par ville/poste.
 *
 * S'abonne à {@link AnnonceFilterService.filter$} pour réagir aux changements
 * de filtre et recharger la liste depuis la page 1.
 * Permet à l'utilisateur de candidater directement depuis une annonce
 * (via {@link CandidatureService.createFromOffer}).
 *
 * @note Ce composant utilise des WritableSignal pour la compatibilité avec
 * provideZonelessChangeDetection() — les signaux déclenchent automatiquement
 * le rendu sans Zone.js.
 */
import { Component, OnInit, signal } from '@angular/core';
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

  // Signaux — déclenchent automatiquement le rendu dans le mode zoneless
  readonly jobs = signal<Job[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly hasMore = signal(false);
  readonly loadingMore = signal(false);

  villes: string[] = [];
  postes: string[] = [];

  // Pagination
  currentPage = 1;
  currentFilter: { ville: string; poste: string } | undefined = undefined;

  // IDs des candidatures créées ou confirmées dans cette session
  private readonly candidatedIds = new Set<string>();

  constructor(
    private jobService: JobService,
    private candidatureService: CandidatureService,
    private annonceFilterService: AnnonceFilterService,
  ) { }

  ngOnInit(): void {
    // filter$ est un BehaviorSubject : il émet la valeur courante immédiatement à la souscription,
    // ce qui déclenche le premier loadJobs automatiquement — pas besoin d'un appel explicite.
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
    this.loading.set(true);
    this.error.set(null);
    this.currentPage = 1;
    this.jobs.set([]);
    this.currentFilter = filtre;

    const cleanFilter: Record<string, string> = {};
    if (filtre?.ville?.trim()) cleanFilter['ville'] = filtre.ville.trim();
    if (filtre?.poste?.trim()) cleanFilter['poste'] = filtre.poste.trim();

    this.jobService.getJobs(cleanFilter, this.currentPage).subscribe({
      next: (response) => {
        const jobs = Array.isArray(response) ? response : response.jobs || [];
        const hasMore = Array.isArray(response) ? false : (response.hasMore ?? false);

        this.villes = Array.from(new Set(jobs.map((j) => j.location).filter(Boolean)));
        this.postes = Array.from(new Set(jobs.map((j) => j.title).filter(Boolean)));

        this.jobs.set(jobs);
        this.hasMore.set(hasMore);
        this.loading.set(false);
        this.loadCandidatures();
      },
      error: () => {
        this.error.set('Impossible de charger les annonces');
        this.loading.set(false);
      },
    });
  }

  /**
   * Charge la page suivante (infinite scroll)
   */
  loadNextPage() {
    if (this.loadingMore() || !this.hasMore()) return;

    this.loadingMore.set(true);
    this.currentPage++;

    const cleanFilter: Record<string, string> = {};
    if (this.currentFilter?.ville?.trim()) cleanFilter['ville'] = this.currentFilter.ville.trim();
    if (this.currentFilter?.poste?.trim()) cleanFilter['poste'] = this.currentFilter.poste.trim();

    this.jobService.getJobs(cleanFilter, this.currentPage).subscribe({
      next: (response) => {
        const jobs = Array.isArray(response) ? response : response.jobs || [];
        const hasMore = Array.isArray(response) ? false : (response.hasMore ?? false);

        this.jobs.update(current => [...current, ...jobs]);
        this.hasMore.set(hasMore);
        this.loadingMore.set(false);
        this.loadCandidatures();
      },
      error: () => {
        this.loadingMore.set(false);
        this.currentPage--;
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
    if (job._candidated) return;

    const candidaturePayload = {
      externalId: job.externalId,
      company: job.company,
      redirectUrl: job.redirectUrl,
      title: job.title,
      location: job.location,
    };

    this.candidatureService.createFromOffer(candidaturePayload).subscribe({
      next: () => {
        this.candidatedIds.add(job.externalId);
        // signal.update() déclenche automatiquement le rendu (zoneless-safe)
        this.jobs.update(jobs =>
          jobs.map(j => ({
            ...j,
            _candidated: j._candidated || this.candidatedIds.has(j.externalId),
          }))
        );
      },
      error: () => {
        // Erreur silencieuse — le bouton reste actif
      },
    });
  }

  trackByJobId(index: number, job: Job) {
    return job.externalId;
  }

  /**
   * Détecte le scroll pour charger la page suivante
   */
  onScroll(event: Event) {
    const element = event.target as HTMLElement;
    const threshold = 200;
    const atBottom = element.scrollHeight - element.scrollTop - element.clientHeight < threshold;
    if (atBottom && this.hasMore() && !this.loadingMore() && !this.loading()) {
      this.loadNextPage();
    }
  }

  loadCandidatures() {
    this.candidatureService.getMyCandidatures().subscribe({
      next: (candidatures) => {
        candidatures.forEach(c => this.candidatedIds.add(c.externalOfferId));
        // signal.update() déclenche automatiquement le rendu (zoneless-safe)
        this.jobs.update(jobs =>
          jobs.map(job => ({
            ...job,
            _candidated: this.candidatedIds.has(job.externalId),
          }))
        );
      },
    });
  }
}
