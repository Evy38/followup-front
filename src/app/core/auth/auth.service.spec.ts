import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('Router', ['navigate']);
    
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: spy }
      ]
    });
    
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and store token', (done) => {
    const mockResponse = { token: 'fake-jwt-token' };
    
    service.login('test@test.com', 'password123').subscribe(() => {
      expect(localStorage.getItem('token')).toBe('fake-jwt-token');
      done();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/login_check`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should return true when token exists', () => {
    localStorage.setItem('token', 'fake-token');
    expect(service.isLogged()).toBe(true);
  });

  it('should return false when no token', () => {
    expect(service.isLogged()).toBe(false);
  });

  it('should remove token on logout', () => {
    localStorage.setItem('token', 'fake-token');
    service.logout();
    expect(localStorage.getItem('token')).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalled();
  });

  it('should call register endpoint', () => {
    const payload = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@test.com',
      password: 'pass123',
      consentRgpd: true
    };

    service.register(payload).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({});
  });

  it('should fetch user data with me()', (done) => {
    const mockUser = { authenticated: true, user: { id: 1, email: 'test@test.com' } };
    
    service.me().subscribe((res) => {
      expect(res).toEqual(mockUser);
      done();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/me`);
    req.flush(mockUser);
  });
});