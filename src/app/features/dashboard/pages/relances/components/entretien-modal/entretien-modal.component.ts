/**
 * Composant Modale Entretien
 * 
 * Composant "Dumb" (présentationnel) pour créer un entretien
 * Émet des événements vers le parent sans logique métier
 * 
 * @author Votre Nom
 * @date 2026-02-08
 */

import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * Interface pour les données du formulaire d'entretien
 */
export interface EntretienFormData {
  date: string;
  heure: string;
}

@Component({
  selector: 'app-entretien-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './entretien-modal.component.html',
  styleUrls: ['./entretien-modal.component.css'],
})
export class EntretienModalComponent {
  /**
   * Contrôle l'affichage de la modale
   */
  @Input() show: boolean = false;

  /**
   * Nom de l'entreprise et du poste pour l'affichage
   */
  @Input() entrepriseNom: string = '';
  @Input() jobTitle: string = '';

  /**
   * Données du formulaire (two-way binding via ngModel)
   */
  @Input() formData: EntretienFormData = { date: '', heure: '' };

  /**
   * Événements émis vers le parent
   */
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<EntretienFormData>();

  /**
   * Gestion de la fermeture
   */
  onClose(): void {
    this.close.emit();
  }

  /**
   * Gestion de la soumission
   */
  onSubmit(): void {
    // Validation basique côté UI
    if (!this.formData.date || !this.formData.heure) {
      return;
    }
    this.submit.emit(this.formData);
  }

  /**
   * Empêche la propagation du clic (pour ne pas fermer la modale)
   */
  stopPropagation(event: Event): void {
    event.stopPropagation();
  }
}