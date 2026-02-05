import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { JobService } from '../../../../core/services/job.service';
import { Job } from '../../models/job.model';
import { CandidatureService } from '../../../../core/services/candidature.service';
import { CommonModule } from '@angular/common';
import { PrivateTopbarComponent } from '../../../../layouts/private-layout/components/private-topbar/private-topbar.component';

@Component({
  selector: 'app-annonces',
  standalone: true,
  imports: [CommonModule, PrivateTopbarComponent],
  templateUrl: './annonces.component.html',
  styleUrls: ['./annonces.component.css'],
})
export class AnnoncesComponent implements OnInit {
  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  villes: string[] = [];
  postes: string[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private jobService: JobService,
    private candidatureService: CandidatureService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadJobs();
    this.candidatureService.refreshNeeded$
      .subscribe(() => this.loadCandidatures());
  }

  loadJobs(filtre?: { ville?: string; poste?: string }) {
    this.loading = true;
    this.jobService.getJobs(filtre).subscribe({
      next: (jobs) => {
        this.jobs = jobs;
        this.filteredJobs = jobs;
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

  lastFiltre: { ville: string; poste: string } = { ville: '', poste: '' };

  onFiltreChange(filtre: { ville: string; poste: string }) {
    this.lastFiltre = filtre;
    
    this.loadJobs({
      ville: filtre.ville,
      poste: filtre.poste,
    });
  }

  applyFiltre(filtre: { ville: string; poste: string }) {
    const ville = filtre.ville.trim().toLowerCase();
    const poste = filtre.poste.trim().toLowerCase();
    this.filteredJobs = this.jobs.filter(job =>
      (!ville || job.location?.toLowerCase().includes(ville)) &&
      (!poste || job.title?.toLowerCase().includes(poste)) 
    );
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
        this.applyFiltre(this.lastFiltre);
        this.cdr.detectChanges();
      },
    });
  }
}