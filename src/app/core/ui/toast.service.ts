/**
 * Service de notifications toast.
 *
 * Expose un `BehaviorSubject<Toast | null>` (`toast$`) consommé par
 * {@link ToastComponent} pour afficher les messages transitoires.
 *
 * Chaque appel à `show()` annule le timer précédent avant d'en relancer un,
 * garantissant une durée d'affichage de 4 secondes depuis le dernier toast.
 * Les raccourcis `success()`, `error()` et `info()` délèguent à `show()`.
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/** Données d'un message toast. */
export interface Toast {
  /** Texte affiché dans le toast */
  message: string;
  /** Niveau de sévérité : succès, erreur ou information */
  type: 'success' | 'error' | 'info';
}

/**
 * Service toast.
 *
 * @example
 * ```typescript
 * this.toast.success('Candidature enregistrée');
 * this.toast.error('Une erreur est survenue');
 * ```
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastSubject = new BehaviorSubject<Toast | null>(null);
  toast$ = this.toastSubject.asObservable();

  private timeoutId: any;

  /**
   * Affiche un toast et le masque automatiquement après 4 secondes.
   *
   * @param message Texte à afficher
   * @param type    Type de toast (`'info'` par défaut)
   */
  show(message: string, type: Toast['type'] = 'info') {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.toastSubject.next({ message, type });

    this.timeoutId = setTimeout(() => {
      this.clear();
    }, 4000);
  }

  success(message: string) {
    this.show(message, 'success');
  }

  error(message: string) {
    this.show(message, 'error');
  }

  info(message: string) {
    this.show(message, 'info');
  }

  clear() {
    this.toastSubject.next(null);
    this.timeoutId = null;
  }
}

