import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" *ngIf="open" (click)="onOverlayClick($event)">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <h2>{{ title }}</h2>
        <p>{{ message }}</p>
        
        <div class="modal-actions">
          <button class="btn-cancel" (click)="onCancel()">{{ cancelText }}</button>
          <button 
            class="btn-confirm" 
            [class.btn-danger]="danger"
            (click)="onConfirm()"
            [disabled]="loading">
            {{ loading ? 'Chargement...' : confirmText }}
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent {
  @Input() open = false;
  @Input() title = 'Confirmation';
  @Input() message = 'Êtes-vous sûr de vouloir continuer ?';
  @Input() confirmText = 'Confirmer';
  @Input() cancelText = 'Annuler';
  @Input() danger = false;
  @Input() loading = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onOverlayClick(event: MouseEvent): void {
    if (!this.loading) {
      this.cancel.emit();
    }
  }

  onConfirm(): void {
    if (!this.loading) {
      this.confirm.emit();
    }
  }

  onCancel(): void {
    if (!this.loading) {
      this.cancel.emit();
    }
  }
}
