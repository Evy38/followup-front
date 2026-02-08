/**
 * Composant Header des relances
 * 
 * Composant "Dumb" (présentationnel) affichant les statistiques
 * Respecte le pattern de séparation Smart/Dumb du REAC CDA
 * 
 * @author Votre Nom
 * @date 2026-02-08
 */

import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Interface pour les données de statistiques
 */
export interface RelancesStats {
  totalCandidatures: number;
  pendingRelances: number;
  doneRelances: number;
}

@Component({
  selector: 'app-relances-header',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './relances-header.component.html',
  styleUrls: ['./relances-header.component.css'],
})
export class RelancesHeaderComponent {
  /**
   * Statistiques à afficher
   * Input depuis le composant parent (Smart)
   */
  @Input() stats: RelancesStats = {
    totalCandidatures: 0,
    pendingRelances: 0,
    doneRelances: 0,
  };
}