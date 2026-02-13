import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService, RegisterPayload } from './auth.service';
import { environment } from '../../../environments/environment';
import { PLATFORM_ID } from '@angular/core';

/**
 * 🧪 TESTS UNITAIRES : AuthService
 * 
 * 🎯 Objectif : Tester les méthodes du service d'authentification
 * 
 * 📌 Ce qu'on teste :
 * - Login et stockage du token JWT
 * - Vérification de l'état de connexion
 * - Déconnexion
 * - Inscription
 * - Récupération des données utilisateur (me)
 * 
 * ✅ Conformité REAC : Tests unitaires services Angular
 */
describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Créer un spy pour le Router
    const spy = jasmine.createSpyObj('Router', ['navigate']);
    
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: spy },
        { provide: PLATFORM_ID, useValue: 'browser' } // Simuler un environnement navigateur
      ]
    });
    
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    
    // Nettoyer le localStorage avant chaque test
    localStorage.clear();
  });

  afterEach(() => {
    // Vérifier qu'il n'y a pas de requêtes HTTP en attente
    httpMock.verify();
    localStorage.clear();
  });

  /**
   * 🧪 TEST #1 : Le service doit être créé
   */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /**
   * 🧪 TEST #2 : Login doit stocker le token JWT
   * 
   * Workflow :
   * 1. Appeler service.login()
   * 2. Le backend retourne un token
   * 3. Le token est stocké dans localStorage
   */
  it('should login and store token in localStorage', (done) => {
    const mockResponse = { token: 'fake-jwt-token-123' };
    
    // Appel de la méthode login
    service.login('test@gmail.com', 'password123').subscribe(() => {
      // Vérifier que le token est bien stocké
      expect(localStorage.getItem('token')).toBe('fake-jwt-token-123');
      done();
    });

    // Simuler la réponse du backend
    const req = httpMock.expectOne(`${environment.apiUrl}/login_check`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'test@gmail.com', password: 'password123' });
    req.flush(mockResponse);
  });

  /**
   * 🧪 TEST #3 : isLogged() doit retourner true si token existe
   */
  it('should return true when token exists', () => {
    localStorage.setItem('token', 'fake-token');
    expect(service.isLogged()).toBe(true);
  });

  /**
   * 🧪 TEST #4 : isLogged() doit retourner false si pas de token
   */
  it('should return false when no token exists', () => {
    expect(service.isLogged()).toBe(false);
  });

  /**
   * 🧪 TEST #5 : logout() doit supprimer le token et rediriger
   */
  it('should remove token on logout and navigate', () => {
    localStorage.setItem('token', 'fake-token');
    
    service.logout();
    
    expect(localStorage.getItem('token')).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalled();
  });

  /**
   * 🧪 TEST #6 : register() doit appeler l'endpoint POST /register
   */
  it('should call register endpoint with correct payload', () => {
    const payload: RegisterPayload = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@gmail.com',
      password: 'SecurePass123',
      consentRgpd: true
    };

    service.register(payload).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ message: 'Compte créé avec succès' });
  });

  /**
   * 🧪 TEST #7 : me() doit récupérer les données utilisateur
   */
  it('should fetch user data with me() and update userSubject', (done) => {
    const mockUserResponse = { 
      authenticated: true, 
      user: { id: 1, email: 'test@gmail.com', isVerified: true, roles: ['ROLE_USER'] } 
    };
    
    service.me().subscribe((res) => {
      expect(res).toEqual(mockUserResponse);
      
      // Vérifier que le currentUser est mis à jour
      expect(service.currentUser).toEqual(mockUserResponse.user);
      done();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/me`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUserResponse);
  });

  /**
   * 🧪 TEST #8 : resendVerificationEmail() doit appeler l'endpoint correct
   */
  it('should call resend verification email endpoint', () => {
    const email = 'test@gmail.com';

    service.resendVerificationEmail(email).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/verify-email/resend`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email });
    req.flush({ message: 'Email envoyé' });
  });
});