import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CandidatureService } from './candidature.service';
import { environment } from '../../../environments/environment';
import { Candidature } from '../models/candidature.model';

describe('CandidatureService', () => {
    let service: CandidatureService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [CandidatureService]
        });

        service = TestBed.inject(CandidatureService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get candidatures', () => {
        const mockCandidatures: Candidature[] = [
            {
                '@id': '/api/candidatures/1',
                id: 1,
                jobTitle: 'Dev Angular',
                dateCandidature: '2024-01-15T10:00:00Z',
                externalOfferId: 'ext-123',
                entreprise: { nom: 'Company A' },
                statut: { libelle: 'En attente' },
                relances: [],
                statutReponse: 'attente'
            },
            {
                '@id': '/api/candidatures/2',
                id: 2,
                jobTitle: 'Dev PHP',
                dateCandidature: '2024-01-16T10:00:00Z',
                externalOfferId: 'ext-456',
                entreprise: { nom: 'Company B' },
                statut: { libelle: 'En attente' },
                relances: [],
                statutReponse: 'attente'
            }
        ];

        service.getMyCandidatures().subscribe((data) => {
            expect(data.length).toBe(2);
            expect(data).toEqual(mockCandidatures);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/my-candidatures`);
        expect(req.request.method).toBe('GET');
        req.flush(mockCandidatures);
    });

    it('should create candidature from offer', () => {
        const job = {
            externalId: '123',
            company: 'Test Co',
            redirectUrl: 'http://test.com',
            title: 'Dev',
            location: 'Paris'
        };

        service.createFromOffer(job).subscribe();

        const req = httpMock.expectOne(`${environment.apiUrl}/candidatures/from-offer`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body.company).toBe('Test Co');
        req.flush({});
    });

    it('should delete candidature by IRI', () => {
        const iri = '/api/candidatures/42';

        service.deleteCandidatureByIri(iri).subscribe();

        const req = httpMock.expectOne(`${environment.apiUrl}${iri}`);
        expect(req.request.method).toBe('DELETE');
        req.flush({});
    });

    it('should update statut reponse', () => {
        const iri = '/api/candidatures/10';
        const statut = 'echanges';

        service.updateStatutReponse(iri, statut).subscribe();

        const req = httpMock.expectOne(`${environment.apiUrl}/candidatures/10/statut-reponse`);
        expect(req.request.method).toBe('PATCH');
        expect(req.request.body.statutReponse).toBe('echanges');
        req.flush({});
    });

    it('should throw error for invalid statut', () => {
        expect(() => {
            service.updateStatutReponse('/api/candidatures/1', 'invalide');
        }).toThrowError();
    });
});