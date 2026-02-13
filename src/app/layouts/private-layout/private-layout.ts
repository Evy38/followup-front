import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { PrivateSidebarComponent } from './components/private-sidebar/private-sidebar.component';
import { PrivateTopbarComponent } from './components/private-topbar/private-topbar.component';
import { AuthService } from '../../core/auth/auth.service';
import { RgpdConsentModalComponent } from '../../shared/rgpd-consent-modal/rgpd-consent-modal.component';


@Component({
  selector: 'app-private-layout',
  standalone: true,
  templateUrl: './private-layout.html',
  styleUrls: ['./private-layout.css'],
  imports: [CommonModule, RouterOutlet, PrivateSidebarComponent, PrivateTopbarComponent, RgpdConsentModalComponent],
})
export class PrivateLayoutComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  showRgpdModal = false;

  private routeContext$ = this.router.events.pipe(
    filter((e): e is NavigationEnd => e instanceof NavigationEnd),
    startWith(null),
    map(() => this.getRouteContext())
  );

  showTopbar$ = this.routeContext$.pipe(
    map((ctx) => ctx !== 'admin' && !this.router.url.includes('/admin'))
  );

  isAnnonces$ = this.routeContext$.pipe(
    map((ctx) => ctx === 'annonces')
  );

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

  private getDeepestChild(route: ActivatedRoute): ActivatedRoute {
    let current = route;
    while (current.firstChild) current = current.firstChild;
    return current;
  }

  private getRouteContext(): string | undefined {
    const route = this.getDeepestChild(this.route);
    const ctx = route.snapshot.data['topbar'] as string | undefined;

    if (ctx) return ctx;

    const url = this.router.url;

    if (url.includes('/admin')) return 'admin';
    if (url.includes('/annonces')) return 'annonces';
    if (url.includes('/relances')) return 'relances';
    if (url.includes('/candidatures')) return 'candidatures';
    if (url.includes('/profile')) return 'profile';
    if (url.includes('/dashboard')) return 'dashboard';

    return undefined;
  }


}
