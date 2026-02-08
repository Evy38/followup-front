import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { JobService } from '../../../../core/services/job.service';
import { Job } from '../../models/job.model';
import { CandidatureService } from '../../../../core/services/candidature.service';
import { CommonModule } from '@angular/common';
import { AnnonceFilterService } from '../../../../core/services/annonce-filter.service';

@Component({
  selector: 'app-annonces',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './annonces.component.html',
  styleUrls: ['./annonces.component.css'],
})
export class AnnoncesComponent implements OnInit {
  jobs: Job[] = [];

  villes: string[] = [];
  postes: string[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private jobService: JobService,
    private candidatureService: CandidatureService,
    private cdr: ChangeDetectorRef,
    private annonceFilterService: AnnonceFilterService

  ) { }

  ngOnInit(): void {
    this.annonceFilterService.filter$.subscribe(filter => {
      this.loadJobs(filter);
    });

    this.candidatureService.refreshNeeded$
      .subscribe(() => this.loadCandidatures());
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

        this.villes = Array.from(new Set(jobs.map(j => j.location).filter(Boolean)));
        this.postes = Array.from(new Set(jobs.map(j => j.title).filter(Boolean)));

        this.loading = false;
        this.cdr.detectChanges();
        this.loadCandidatures();
      },
      error: (err) => {
        console.error('Erreur API jobs:', err);
        this.error = 'Impossible de charger les annonces';
        this.loading = false;
      },
    });
  }



  onCandidated(job: Job) {
    if (job._candidated) return;
    this.candidatureService.createFromOffer({
      externalId: job.externalId,
      company: job.company,
      redirectUrl: job.redirectUrl,
      title: job.title,
      location: job.location,
    }).subscribe({
      next: () => this.loadCandidatures(),
    });
  }


  trackByJobId(index: number, job: Job) {
    return job.externalId;
  }

  loadCandidatures() {
    this.candidatureService.getMyCandidatures().subscribe({
      next: (candidatures) => {
        const candidatedIds = new Set(
          candidatures.map(c => c.externalOfferId)
        );
        this.jobs = this.jobs.map(job => ({
          ...job,
          _candidated: candidatedIds.has(job.externalId),
        }));
        this.cdr.detectChanges();
      },
    });
  }



}