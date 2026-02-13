import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EntretienService, EntretienApi } from './entretien.service';
import { environment } from '../../../environments/environment';

/**
 * 🧪 TESTS UNITAIRES : EntretienService
 * 
 * 🎯 Objectif : Tester les opérations CRUD sur les entretiens
 * 
 * 📌 Ce qu'on teste :
 * - Création d'un entretien
 * - Mise à jour (statut + résultat)
 * - Suppression
 */
describe('EntretienService', () => {
  let service: EntretienService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EntretienService]
    });
    
    service = TestBed.inject(EntretienService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  /**
   * 🧪 TEST #1 : Le service doit être créé
   */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /**
   * 🧪 TEST #2 : createEntretien() doit créer un entretien
   */
  it('should create entretien with correct payload', () => {
    const mockResponse: EntretienApi = {
      '@id': '/api/entretiens/1',
      id: 1,
      dateEntretien: '2025-03-15',
      heureEntretien: '10:00:00',
      statut: 'prevu'
    };

    service.createEntretien('/api/candidatures/5', '2025-03-15', '10:00:00').subscribe((data) => {
      expect(data.statut).toBe('prevu');
      expect(data.dateEntretien).toBe('2025-03-15');
      expect(data.heureEntretien).toBe('10:00:00');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/entretiens`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.candidature).toBe('/api/candidatures/5');
    expect(req.request.body.dateEntretien).toBe('2025-03-15');
    expect(req.request.body.heureEntretien).toBe('10:00:00');
    expect(req.request.body.statut).toBe('prevu');
    expect(req.request.headers.get('Content-Type')).toBe('application/ld+json');
    
    req.flush(mockResponse);
  });

  /**
   * 🧪 TEST #3 : updateEntretien() doit mettre à jour le statut
   */
  it('should update entretien status and result', () => {
    const mockResponse: EntretienApi = {
      '@id': '/api/entretiens/2',
      id: 2,
      dateEntretien: '2025-03-15',
      heureEntretien: '10:00:00',
      statut: 'passe',
      resultat: 'engage'
    };

    service.updateEntretien('/api/entretiens/2', 'passe', 'engage').subscribe((data) => {
      expect(data.statut).toBe('passe');
      expect(data.resultat).toBe('engage');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/entretiens/2`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body.statut).toBe('passe');
    expect(req.request.body.resultat).toBe('engage');
    expect(req.request.headers.get('Content-Type')).toBe('application/merge-patch+json');
    
    req.flush(mockResponse);
  });

  /**
   * 🧪 TEST #4 : deleteEntretien() doit supprimer un entretien
   */
  it('should delete entretien by IRI', () => {
    const entretienIri = '/api/entretiens/3';

    service.deleteEntretien(entretienIri).subscribe();

    const req = httpMock.expectOne(`${environment.backendUrl}${entretienIri}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  /**
   * 🧪 TEST #5 : updateEntretien() avec statut 'annule' sans résultat
   */
  it('should update entretien to annule without result', () => {
    service.updateEntretien('/api/entretiens/4', 'annule').subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/api/entretiens/4`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body.statut).toBe('annule');
    expect(req.request.body.resultat).toBeUndefined();
    
    req.flush({ statut: 'annule' });
  });
});