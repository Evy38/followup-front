import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { DashboardHomeComponent } from './dashboard-home.component';
import { CandidatureService } from '../../../../core/services/candidature.service';
import { Candidature } from '../../../../core/models/candidature.model';
import { of, throwError } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

/**
 * 🧪 TESTS DE COMPOSANT : DashboardHomeComponent
 * 
 * 🎯 Objectif : Tester l'affichage des statistiques du dashboard
 * 
 * 📌 Ce qu'on teste :
 * - Chargement des candidatures
 * - Calcul des statistiques (total, relances, entretiens)
 * - Gestion des erreurs
 */
describe('DashboardHomeComponent', () => {
  let component: DashboardHomeComponent;
  let fixture: ComponentFixture<DashboardHomeComponent>;
  let candidatureService: jasmine.SpyObj<CandidatureService>;
  let cdr: jasmine.SpyObj<ChangeDetectorRef>;

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('CandidatureService', ['getMyCandidatures']);
    const cdrSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    await TestBed.configureTestingModule({
      imports: [DashboardHomeComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: CandidatureService, useValue: serviceSpy },
        { provide: ChangeDetectorRef, useValue: cdrSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardHomeComponent);
    component = fixture.componentInstance;
    candidatureService = TestBed.inject(CandidatureService) as jasmine.SpyObj<CandidatureService>;
    cdr = TestBed.inject(ChangeDetectorRef) as jasmine.SpyObj<ChangeDetectorRef>;
  });

  afterEach(() => {
    component.candidatures = [];
    fixture.destroy();
  });

  /**
   * 🧪 TEST #1 : Le composant doit être créé
   */
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  /**
   * 🧪 TEST #2 : ngOnInit() doit charger les candidatures
   */
  it('should load candidatures on init', () => {
    const mockCandidatures: Partial<Candidature>[] = [
      { 
        id: '00000000-0000-0000-0000-000000000001',
        jobTitle: 'Dev Angular',
        relances: [], 
        entretiens: [] 
      },
      { 
        id: '00000000-0000-0000-0000-000000000002',
        jobTitle: 'Dev PHP',
        relances: [], 
        entretiens: [] 
      }
    ];
    
    candidatureService.getMyCandidatures.and.returnValue(of(mockCandidatures as Candidature[]));

    component.ngOnInit();

    expect(candidatureService.getMyCandidatures).toHaveBeenCalled();
    expect(component.candidatures.length).toBe(2);
    expect(component.loading).toBe(false);
  });

  /**
   * 🧪 TEST #3 : totalCandidatures doit retourner le nombre total
   */
  it('should calculate total candidatures correctly', () => {
    component.candidatures = [
      { id: '00000000-0000-0000-0000-000000000001' } as Candidature,
      { id: '00000000-0000-0000-0000-000000000002' } as Candidature,
      { id: '00000000-0000-0000-0000-000000000003' } as Candidature
    ];

    expect(component.totalCandidatures).toBe(3);
  });

  /**
   * 🧪 TEST #4 : entretiensPrevus doit compter les entretiens prévus
   */
  it('should calculate entretiens prevus correctly', () => {
    component.candidatures = [
      { 
        id: '00000000-0000-0000-0000-000000000001',
        entretiens: [
          { statut: 'prevu' } as any,
          { statut: 'prevu' } as any
        ] 
      } as Candidature,
      { 
        id: '00000000-0000-0000-0000-000000000002',
        entretiens: [
          { statut: 'passe' } as any
        ] 
      } as Candidature
    ];

    expect(component.entretiensPrevus).toBe(2);
  });

  /**
   * 🧪 TEST #5 : relancesEffectuees doit compter les relances faites
   */
  it('should calculate relances effectuees correctly', () => {
    component.candidatures = [
      { 
        id: '00000000-0000-0000-0000-000000000001',
        relances: [
          { faite: true } as any,
          { faite: true } as any
        ] 
      } as Candidature,
      { 
        id: '00000000-0000-0000-0000-000000000002',
        relances: [
          { faite: false } as any,
          { faite: true } as any
        ] 
      } as Candidature
    ];

    expect(component.relancesEffectuees).toBe(3);
  });

  /**
   * 🧪 TEST #6 : retoursPositifs doit compter les résultats positifs
   */
  it('should calculate retours positifs correctly', () => {
    component.candidatures = [
      { 
        id: '00000000-0000-0000-0000-000000000001',
        statutReponse: 'engage',
        entretiens: []
      } as unknown as Candidature,
      { 
        id: '00000000-0000-0000-0000-000000000002',
        statutReponse: 'attente',
        entretiens: [
          { statut: 'passe', resultat: 'engage' } as any
        ]
      } as unknown as Candidature,
      { 
        id: '00000000-0000-0000-0000-000000000003',
        statutReponse: 'attente',
        entretiens: [
          { statut: 'passe', resultat: 'negative' } as any
        ]
      } as unknown as Candidature
    ];

    expect(component.retoursPositifs).toBe(2);
  });

  /**
   * 🧪 TEST #7 : Gestion des erreurs lors du chargement
   */
  it('should handle error when loading candidatures fails', () => {
    const consoleErrorSpy = spyOn(console, 'error');
    candidatureService.getMyCandidatures.and.returnValue(
      throwError(() => new Error('Network error'))
    );

    component.ngOnInit();

    expect(component.loading).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  /**
   * 🧪 TEST #8 : Candidatures vides doit retourner 0
   */
  it('should return 0 for empty candidatures array', () => {
    component.candidatures = [];

    expect(component.totalCandidatures).toBe(0);
    expect(component.entretiensPrevus).toBe(0);
    expect(component.relancesEffectuees).toBe(0);
    expect(component.retoursPositifs).toBe(0);
  });
});