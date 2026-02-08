import { Component, inject } from '@angular/core';
import { Output, EventEmitter, Input } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { AnnonceFilterService } from '../../../../core/services/annonce-filter.service';


type TopbarContext = 'dashboard' | 'annonces' | 'candidatures' | 'relances' | 'profil';

@Component({
  selector: 'app-private-topbar',
  standalone: true,
  imports: [AsyncPipe, CommonModule, FormsModule],
  templateUrl: './private-topbar.component.html',
  styleUrls: ['./private-topbar.component.css'],
})
export class PrivateTopbarComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private annonceFilterService = inject(AnnonceFilterService);


  @Input() villes: string[] = [];
  @Input() postes: string[] = [];

  filtre = {
    ville: '',
    poste: ''
  };

  // Pour l'autocomplétion ville
  villeInput: string = '';
  showVilleList: boolean = false;
  get filteredVilles(): string[] {
    if (!this.villeInput) return this.villes;
    return this.villes.filter(v => v.toLowerCase().includes(this.villeInput.toLowerCase()));
  }

  onVilleInputChange(value: string) {
    this.villeInput = value;
    this.filtre.ville = value;
    this.showVilleList = !!this.filteredVilles.length && !!value;
  }
  onVilleSelect(ville: string) {
    this.filtre.ville = ville;
    this.villeInput = ville;
    this.showVilleList = false;
  }
  onVilleBlur() {
    setTimeout(() => this.showVilleList = false, 200);
  }

  // Observable du contexte topbar en fonction de la route active
  topbarContext$ = this.router.events.pipe(
    filter((e): e is NavigationEnd => e instanceof NavigationEnd),
    startWith(null),
    map(() => {
      const route = this.getDeepestChild(this.route);
      const ctx = route.snapshot.data['topbar'] as TopbarContext | undefined;

      // ✅ fallback intelligent
      if (ctx) return ctx;

      const url = this.router.url;

      if (url.includes('/annonces')) return 'annonces';
      if (url.includes('/relances')) return 'relances';
      if (url.includes('/candidatures')) return 'candidatures';

      return 'dashboard';
    })
  );


  private getDeepestChild(route: ActivatedRoute): ActivatedRoute {
    let current = route;
    while (current.firstChild) current = current.firstChild;
    return current;
  }

onFiltreChange() {
  this.annonceFilterService.updateFilter({ ...this.filtre });
}

}