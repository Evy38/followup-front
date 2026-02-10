import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrivateSidebarComponent } from './components/private-sidebar/private-sidebar.component';
import { PrivateTopbarComponent } from './components/private-topbar/private-topbar.component';
import { AuthService } from '../../core/auth/auth.service';
import { RgpdConsentModalComponent } from '../../shared/rgpd-consent-modal/rgpd-consent-modal.component';


@Component({
  selector: 'app-private-layout',
  standalone: true,
  templateUrl: './private-layout.html',
  styleUrls: ['./private-layout.css'],
  imports: [RouterOutlet, PrivateSidebarComponent, PrivateTopbarComponent, RgpdConsentModalComponent],
})
export class PrivateLayoutComponent {
  private auth = inject(AuthService);

  showRgpdModal = false;

  ngOnInit(): void {
    this.auth.me().subscribe({
      next: (res) => {
        const user = res?.user;

        // 🔹 refus temporaire pour la session
        const dismissedForSession =
          sessionStorage.getItem('rgpd_modal_dismissed') === 'true';

        // 🔹 affichage uniquement si :
        // - utilisateur OAuth
        // - consentement jamais donné
        // - pas refusé pour la session
        const mustShowRgpdModal =
          !!user &&
          user.isOAuth === true &&
          user.consentRgpd === false &&
          user.consentRgpdAt === null &&
          !dismissedForSession;

        this.showRgpdModal = mustShowRgpdModal;
      },
    });
  }

  closeRgpdModal(): void {

    sessionStorage.setItem('rgpd_modal_dismissed', 'true');
    this.showRgpdModal = false;
  }

  acceptRgpd(): void {
    // fermer immédiatement la modale (UX)
    this.showRgpdModal = false;

    this.auth.acceptRgpd().subscribe({
      next: () => {
        sessionStorage.removeItem('rgpd_modal_dismissed');
      },
      error: () => {
        // optionnel : rollback UI
      },
    });
  }


}
