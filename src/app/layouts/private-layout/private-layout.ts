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
    next: (res: any) => {
      const user = res?.user;

      const mustShowRgpdModal =
        user &&
        user.consentRgpd === false &&
        user.consentRgpdAt === null;

      this.showRgpdModal = mustShowRgpdModal;
    },
    error: () => {
    },
  });
}


  closeRgpdModal(): void {
    this.showRgpdModal = false;
  }

  acceptRgpd(): void {
    this.auth.acceptRgpd().subscribe({
      next: () => {
        this.showRgpdModal = false;
      },
      error: () => {
        // si échec, on laisse la modale ouverte
      },
    });
  }

}
