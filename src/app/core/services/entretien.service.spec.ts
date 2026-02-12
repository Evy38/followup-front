import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EntretienService } from './entretien.service';
import { environment } from '../../../environments/environment';

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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create entretien', () => {
    const mockEntretien = {
      '@id': '/api/entretiens/1',
      id: 1,
      dateEntretien: '2025-03-15',
      heureEntretien: '10:00:00',
      statut: 'prevu' as const
    };

    service.createEntretien('/api/candidatures/5', '2025-03-15', '10:00:00').subscribe((data) => {
      expect(data.statut).toBe('prevu');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/entretiens`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.candidature).toBe('/api/candidatures/5');
    req.flush(mockEntretien);
  });

  it('should update entretien', () => {
    service.updateEntretien('/api/entretiens/2', 'passe', 'engage').subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/api/entretiens/2`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body.statut).toBe('passe');
    expect(req.request.body.resultat).toBe('engage');
    req.flush({});
  });

  it('should delete entretien', () => {
    service.deleteEntretien('/api/entretiens/3').subscribe();

    const req = httpMock.expectOne(`${environment.backendUrl}/api/entretiens/3`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});