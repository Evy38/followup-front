/**
 * Modale de consentement RGPD.
 *
 * Affichée au premier accès au tableau de bord si l'utilisateur n'a pas
 * encore donné son consentement (`user.consentRgpd = false`).
 * Émet `accepted` quand l'utilisateur accepte (déclenche `POST /api/user/consent`)
 * ou `dismissed` s'il ferme sans accepter (mémorisé en sessionStorage pour
 * éviter de ré-afficher la modale pendant la session).
 */
import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rgpd-consent-modal',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './rgpd-consent-modal.component.html',
  styleUrl: './rgpd-consent-modal.component.css',
})
export class RgpdConsentModalComponent {
  @Input() open = false;

  @Output() close = new EventEmitter<void>();
  @Output() accept = new EventEmitter<void>();

  checked = false;

  onAccept(): void {
    if (!this.checked) return;
    this.accept.emit();
    this.close.emit()
  }
}
