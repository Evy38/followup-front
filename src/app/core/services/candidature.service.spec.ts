import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CandidatureService, CreateCandidatureFromOfferPayload } from './candidature.service';
import { environment } from '../../../environments/environment';

/**
 * 🧪 TESTS UNITAIRES : CandidatureService
 * 
 * 🎯 Objectif : Tester les méthodes du service de gestion des candidatures
 * 
 * 📌 Ce qu'on teste :
 * - Récupération des candidatures (GET)
 * - Création depuis une offre (POST)
 * - Suppression (DELETE)
 * - Mise à jour du statut (PATCH)
 * - Validation des données
 */
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

    /**
     * 🧪 TEST #1 : Le service doit être créé
     */
    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    /**
     * 🧪 TEST #2 : getMyCandidatures() doit récupérer les candidatures
     */
    it('should get user candidatures from API', () => {
        const mockCandidatures = [
            {
                '@id': '/api/candidatures/1',
                id: 1,
                jobTitle: 'Développeur Angular',
                dateCandidature: '2024-01-15T10:00:00Z',
                externalOfferId: 'ext-123',
                entreprise: { nom: 'TechCorp' },
                relances: [],
                statutReponse: 'attente'
            },
            {
                '@id': '/api/candidatures/2',
                id: 2,
                jobTitle: 'Développeur PHP',
                dateCandidature: '2024-01-16T10:00:00Z',
                externalOfferId: 'ext-456',
                entreprise: { nom: 'WebAgency' },
                relances: [],
                statutReponse: 'entretien'
            }
        ];

        service.getMyCandidatures().subscribe((data) => {
            expect(data.length).toBe(2);
            expect(data[0].jobTitle).toBe('Développeur Angular');
            expect(data[1].jobTitle).toBe('Développeur PHP');
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/my-candidatures`);
        expect(req.request.method).toBe('GET');
        req.flush(mockCandidatures);
    });

    /**
     * 🧪 TEST #3 : createFromOffer() doit créer une candidature
     */
    it('should create candidature from external offer', () => {
        const payload: CreateCandidatureFromOfferPayload = {
            externalId: 'adzuna-123',
            company: 'TechCorp SAS',
            redirectUrl: 'https://adzuna.fr/job/123',
            title: 'Développeur Full Stack',
            location: 'Paris 75001'
        };

        service.createFromOffer(payload).subscribe((response) => {
            expect(response.id).toBe(42);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/candidatures/from-offer`);
        expect(req.request.method).toBe('POST');
        
        // Vérifier que le payload est correct
        expect(req.request.body.externalId).toBe('adzuna-123');
        expect(req.request.body.company).toBe('TechCorp SAS');
        expect(req.request.body.redirectUrl).toBe('https://adzuna.fr/job/123');
        
        req.flush({ id: 42, '@id': '/api/candidatures/42' });
    });

    /**
     * 🧪 TEST #4 : deleteCandidatureByIri() doit supprimer une candidature
     */
    it('should delete candidature by IRI', () => {
        const iri = '/api/candidatures/42';

        service.deleteCandidatureByIri(iri).subscribe();

        const req = httpMock.expectOne(`${environment.apiUrl}${iri}`);
        expect(req.request.method).toBe('DELETE');
        req.flush(null);
    });

    /**
     * 🧪 TEST #5 : updateStatutReponse() doit mettre à jour le statut
     */
    it('should update statut reponse with valid statut', () => {
        const iri = '/api/candidatures/10';
        const statut = 'entretien';

        service.updateStatutReponse(iri, statut).subscribe((response) => {
            expect(response.statutReponse).toBe('entretien');
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/candidatures/10/statut-reponse`);
        expect(req.request.method).toBe('PATCH');
        expect(req.request.body.statutReponse).toBe('entretien');
        req.flush({ statutReponse: 'entretien' });
    });

    /**
     * 🧪 TEST #6 : updateStatutReponse() doit rejeter un statut invalide
     */
    it('should throw error for invalid statut', () => {
        const iri = '/api/candidatures/1';
        const invalidStatut = 'statut_invalide';

        expect(() => {
            service.updateStatutReponse(iri, invalidStatut);
        }).toThrowError(/Statut non autorisé/);
    });

    /**
     * 🧪 TEST #7 : createFromOffer() doit valider les champs obligatoires
     */
    it('should throw error if required fields are missing', () => {
        const invalidPayload = {
            externalId: '',
            company: 'Test',
            redirectUrl: 'http://test.com'
        } as CreateCandidatureFromOfferPayload;

        expect(() => {
            service.createFromOffer(invalidPayload).subscribe();
        }).toThrowError(/Champs obligatoires manquants/);
    });
});