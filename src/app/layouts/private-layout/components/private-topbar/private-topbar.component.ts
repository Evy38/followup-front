import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

type TopbarContext = 'dashboard' | 'annonces' | 'candidatures' | 'relances' | 'profil';

@Component({
  selector: 'app-private-topbar',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './private-topbar.component.html',
  styleUrls: ['./private-topbar.component.css'],
})
export class PrivateTopbarComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Observable du contexte topbar en fonction de la route active
  topbarContext$ = this.router.events.pipe(
    filter((e) => e instanceof NavigationEnd),
    startWith(null),
    map(() => this.getDeepestChild(this.route)),
    map((r) => (r.snapshot.data['topbar'] as TopbarContext) ?? 'dashboard')
  );

  private getDeepestChild(route: ActivatedRoute): ActivatedRoute {
    let current = route;
    while (current.firstChild) current = current.firstChild;
    return current;
  }
}
