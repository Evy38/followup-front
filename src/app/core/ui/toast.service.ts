import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastSubject = new BehaviorSubject<Toast | null>(null);
  toast$ = this.toastSubject.asObservable();

  private timeoutId: any;

  show(message: string, type: Toast['type'] = 'info') {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.toastSubject.next({ message, type });

    this.timeoutId = setTimeout(() => {
      this.clear();
    }, 4000);
  }

  clear() {
    this.toastSubject.next(null);
    this.timeoutId = null;
  }
}

