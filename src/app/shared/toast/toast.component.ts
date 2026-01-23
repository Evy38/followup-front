import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/ui/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="toast$ | async as toast"
         class="toast"
         [class.success]="toast.type === 'success'"
         [class.error]="toast.type === 'error'">
      {{ toast.message }}
    </div>
  `,
  styleUrls: ['./toast.component.css']
})
export class ToastComponent {
  toast$: typeof this.toastService.toast$;

  constructor(private toastService: ToastService) {
    this.toast$ = this.toastService.toast$;
  }
}
