import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService, RegisterPayload } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthService,
        { provide: Router, useValue: spy },
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('login() should POST to login_check and NOT store anything in localStorage', (done) => {
    service.login('test@gmail.com', 'password123').subscribe(() => {
      expect(localStorage.getItem('token')).toBeNull();
      done();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/login_check`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'test@gmail.com', password: 'password123' });
    req.flush({ authenticated: true });
  });

  it('isLogged() should return false when no user is loaded', () => {
    expect(service.isLogged()).toBe(false);
  });

  it('isLogged() should return true after me() loads a user', (done) => {
    const mockUserResponse = {
      authenticated: true,
      user: { id: '00000000-0000-0000-0000-000000000001', email: 'test@gmail.com', roles: ['ROLE_USER'] }
    };

    service.me().subscribe(() => {
      expect(service.isLogged()).toBe(true);
      done();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/me`);
    req.flush(mockUserResponse);
  });

  it('logout() should call POST /api/logout and navigate', (done) => {
    routerSpy.navigate.and.returnValue(Promise.resolve(true));

    service.logout();

    const req = httpMock.expectOne(`${environment.apiUrl}/logout`);
    expect(req.request.method).toBe('POST');
    req.flush({ message: 'Déconnexion réussie.' });

    setTimeout(() => {
      expect(routerSpy.navigate).toHaveBeenCalled();
      done();
    }, 0);
  });

  it('logout() should clear the current user', (done) => {
    // Simuler un utilisateur connecté
    const mockUserResponse = {
      authenticated: true,
      user: { id: '00000000-0000-0000-0000-000000000001', email: 'test@gmail.com', roles: ['ROLE_USER'] }
    };
    service.me().subscribe();
    httpMock.expectOne(`${environment.apiUrl}/me`).flush(mockUserResponse);

    routerSpy.navigate.and.returnValue(Promise.resolve(true));
    service.logout();
    httpMock.expectOne(`${environment.apiUrl}/logout`).flush({});

    setTimeout(() => {
      expect(service.currentUser).toBeNull();
      done();
    }, 0);
  });

  it('register() should POST to /register with correct payload', () => {
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

  it('me() should update currentUser on success', (done) => {
    const mockUserResponse = {
      authenticated: true,
      user: { id: '00000000-0000-0000-0000-000000000001', email: 'test@gmail.com', roles: ['ROLE_USER'] }
    };

    service.me().subscribe((res) => {
      expect(res).toEqual(mockUserResponse);
      expect(service.currentUser).toEqual(mockUserResponse.user);
      done();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/me`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUserResponse);
  });

  it('resendVerificationEmail() should POST to correct endpoint', () => {
    const email = 'test@gmail.com';

    service.resendVerificationEmail(email).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/verify-email/resend`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email });
    req.flush({ message: 'Email envoyé' });
  });
});
