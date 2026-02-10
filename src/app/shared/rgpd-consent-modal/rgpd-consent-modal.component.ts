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
  }
}
