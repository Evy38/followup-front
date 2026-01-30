import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { JobService } from '../../../../core/services/job.service';
import { Job } from '../../models/job.model';
import { CandidatureService } from '../../../../core/services/candidature.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-annonces',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './annonces.component.html',
  styleUrls: ['./annonces.component.css'],
})
export class AnnoncesComponent implements OnInit {
  jobs: Job[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private jobService: JobService,
    private candidatureService: CandidatureService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.jobService.getJobs().subscribe({
      next: (jobs) => {
        this.jobs = jobs;
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

    this.candidatureService.refreshNeeded$
      .subscribe(() => this.loadCandidatures());
  };

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
