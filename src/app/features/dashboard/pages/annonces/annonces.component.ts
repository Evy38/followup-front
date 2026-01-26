import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { JobService } from '../../services/job.service';
import { Job } from '../../models/job.model';

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

  constructor(private jobService: JobService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.jobService.getJobs().subscribe({
      next: (jobs) => {
        console.log('Réponse API jobs:', jobs);
        this.jobs = jobs;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur API jobs:', err);
        this.error = 'Impossible de charger les annonces';
        this.loading = false;
      },
    });
  }
}
