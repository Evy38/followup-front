import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { JobService } from '../../../../core/services/job.service';
import { ContractTypeService, ContractType } from '../../../../core/services/contract-type.service';
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
  contrats: ContractType[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private jobService: JobService,
    private candidatureService: CandidatureService,
    private contractTypeService: ContractTypeService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadContractTypes();
    this.loadJobs();
    this.candidatureService.refreshNeeded$
      .subscribe(() => this.loadCandidatures());
  }

  loadContractTypes() {
    this.contractTypeService.getContractTypes().subscribe({
      next: (types) => {
        this.contrats = types;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement types de contrats:', err);
      }
    });
  }

  loadJobs(filtre?: { ville?: string; poste?: string; contrat?: string }) {
    this.loading = true;
    this.jobService.getJobs(filtre).subscribe({
      next: (jobs) => {
        this.jobs = jobs;
        this.filteredJobs = jobs;
        this.villes = Array.from(new Set(jobs.map(j => j.location).filter(Boolean)));
        this.postes = Array.from(new Set(jobs.map(j => j.title).filter(Boolean)));
        // On ne touche plus à this.contrats ici, elle vient de l'API
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

  lastFiltre: { ville: string; poste: string; contrat: string } = { ville: '', poste: '', contrat: '' };

  onFiltreChange(filtre: { ville: string; poste: string; contrat: string }) {
    this.lastFiltre = filtre;
    // On envoie le champ poste (input texte) comme paramètre 'poste' à l'API
    this.loadJobs({
      ville: filtre.ville,
      poste: filtre.poste,
      contrat: filtre.contrat
    });
  }

  applyFiltre(filtre: { ville: string; poste: string; contrat: string }) {
    const ville = filtre.ville.trim().toLowerCase();
    const poste = filtre.poste.trim().toLowerCase();
    const contrat = filtre.contrat;
    this.filteredJobs = this.jobs.filter(job =>
      (!ville || job.location?.toLowerCase().includes(ville)) &&
      (!poste || job.title?.toLowerCase().includes(poste)) &&
      (!contrat || job.contractType === contrat)
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
