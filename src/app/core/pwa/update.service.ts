import { Injectable, inject } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

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
