import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RelancesFacade } from './relances.facade';
import { Candidature } from '../../models/candidature.model';
import { Relance } from '../../models/relance.model';

import { RelancesHeaderComponent } from './components/relances-header/relances-header.component';
import {
  EntretienModalComponent,
  EntretienFormData,
} from './components/entretien-modal/entretien-modal.component';

import * as RelancesHelpers from './helpers/relances.helpers';

@Component({
  selector: 'app-relances',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RelancesHeaderComponent,
    EntretienModalComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './relances.component.html',
  styleUrls: ['./relances.component.css'],
})
export class RelancesComponent implements OnInit {
  private facade = inject(RelancesFacade);

  readonly candidatures$ = this.facade.candidatures$;
  readonly stats$ = this.facade.stats$;

  filterStatus: 'relances' | 'reponses' = 'relances';

  showEntretienModal = false;
  selectedCandidature: Candidature | null = null;
  entretienForm: EntretienFormData = { date: '', heure: '' };

  helpers = RelancesHelpers;

  ngOnInit(): void {
    this.facade.load();
  }

  // =========================
  // RELANCES
  // =========================
  markDone(r: Relance) {
    this.facade.markRelance(r, true);
  }

  markUndone(r: Relance) {
    this.facade.markRelance(r, false);
  }

  // =========================
  // STATUT
  // =========================
  updateStatut(
    c: Candidature,
    statut: 'attente' | 'echanges' | 'negative' | 'engage'
  ) {
    // Si un entretien est prévu, on ne peut changer le statut que vers "engage" si un entretien passé est réussi
    if (this.helpers.hasEntretienPrevu(c) && statut !== 'engage') {
      return;
    }
    if (this.helpers.hasEntretienPrevu(c) && statut === 'engage' && !this.helpers.hasEntretienReussi(c)) {
      return;
    }
    this.facade.updateStatut(c, statut);
  }

  // =========================
  // ENTRETIENS
  // =========================
  openEntretien(c: Candidature) {
    this.selectedCandidature = c;
    this.entretienForm = { date: '', heure: '' };
    this.showEntretienModal = true;
  }

  closeEntretien() {
    this.showEntretienModal = false;
    this.selectedCandidature = null;
  }

  submitEntretien(data: EntretienFormData) {
    if (!this.selectedCandidature) return;
    this.facade.createEntretien(
      this.selectedCandidature,
      data.date,
      data.heure
    );
    this.closeEntretien();
  }

deleteEntretien(c: Candidature, e: any, event: MouseEvent) {
  event.stopPropagation(); // ⚠️ Empêche la propagation
  console.log('🗑️ Suppression entretien', e); // DEBUG
  this.facade.deleteEntretien(c, e);
}
}
