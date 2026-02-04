import { Component, inject } from '@angular/core';
import { Output, EventEmitter, Input } from '@angular/core';
import { ContractType } from '../../../../core/services/contract-type.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

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

  @Input() villes: string[] = [];
  @Input() postes: string[] = [];
  @Input() contrats: ContractType[] = [];

  filtre = {
    ville: '',
    poste: '',
    contrat: ''
  };

  @Output() filtreChange = new EventEmitter<{ ville: string; poste: string; contrat: string }>();

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

  onFiltreChange() {
    this.filtreChange.emit({ ...this.filtre });
  }
}