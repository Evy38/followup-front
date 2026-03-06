/**
 * Service de mise à jour PWA (Progressive Web App).
 *
 * S'abonne au flux `SwUpdate.versionUpdates` du Service Worker Angular.
 * Lorsqu'une nouvelle version de l'application est disponible, propose
 * à l'utilisateur de mettre à jour via une boîte de confirmation.
 * En cas d'acceptation, active la mise à jour et recharge la page.
 *
 * Ce service doit être injecté au démarrage de l'application (dans `AppComponent`
 * ou `app.config.ts`) pour activer la surveillance.
 */
import { Injectable, inject } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

/**
 * Service de gestion des mises à jour du Service Worker.
 *
 * Ne fait rien si le Service Worker est désactivé (`swUpdate.isEnabled = false`),
 * ce qui est le cas en développement.
 */
@Injectable({ providedIn: 'root' })
export class UpdateService {
  private swUpdate = inject(SwUpdate);

  constructor() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.subscribe(async () => {
        const wants = confirm('Nouvelle version disponible. Mettre à jour ?');
        if (wants) {
          await this.swUpdate.activateUpdate();
          document.location.reload();
        }
      });
    }
  }
}
