import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from '../../auth/login/login';
import { AuthService } from '../../../core/auth/auth.service';
import { ToastService } from '../../../core/ui/toast.service';
import { of, throwError, BehaviorSubject } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';

/**
 * 🧪 TESTS DE COMPOSANT : LoginComponent
 * 
 * 🎯 Objectif : Tester les interactions utilisateur et la logique du composant
 * 
 * 📌 Ce qu'on teste :
 * - Création du composant
 * - Appel de la méthode login()
 * - Gestion des erreurs de connexion
 * - Toggle de la modal signup
 */
describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let authErrorSubject: BehaviorSubject<string | null>;

  beforeEach(async () => {
    // Créer un BehaviorSubject pour simuler authError$
    authErrorSubject = new BehaviorSubject<string | null>(null);

    // Créer un spy pour AuthService
    const authSpy = jasmine.createSpyObj('AuthService', [
      'login',
      'me',
      'clearAuthError',
      'googleLogin',
      'resendVerificationEmail'
    ]);

    // Configurer authError$ comme observable
    Object.defineProperty(authSpy, 'authError$', {
      get: () => authErrorSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule
      ],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: PLATFORM_ID, useValue: 'browser' },
        ToastService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    fixture.detectChanges();
  });

  /**
   * 🧪 TEST #1 : Le composant doit être créé
   */
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  /**
   * 🧪 TEST #2 : login() doit appeler authService.login()
   */
  it('should call authService.login() when login is submitted', () => {
    const mockUser = {
      authenticated: true,
      user: { id: '00000000-0000-0000-0000-000000000001', email: 'test@gmail.com', isVerified: true, roles: ['ROLE_USER'], consentRgpd: true }
    };

    authService.login.and.returnValue(of({ token: 'fake-jwt-token' }));
    authService.me.and.returnValue(of(mockUser));

    component.email = 'test@gmail.com';
    component.password = 'SecurePass123';
    component.login();

    expect(authService.login).toHaveBeenCalledWith('test@gmail.com', 'SecurePass123');
    expect(authService.me).toHaveBeenCalled();
  });

  /**
   * 🧪 TEST #3 : login() doit afficher une erreur si identifiants invalides
   */
  it('should display error message on invalid credentials', () => {
    authService.login.and.returnValue(throwError(() => ({ status: 401, message: 'Unauthorized' })));

    component.email = 'wrong@gmail.com';
    component.password = 'wrongpass';
    component.login();

    expect(component.loading).toBe(false);
    expect(component.message).toContain('Identifiants invalides');
  });

  /**
   * 🧪 TEST #4 : toggleSignup() doit afficher/masquer la modal signup
   */
  it('should toggle signup modal visibility', () => {
    expect(component.showWelcome).toBe(false);

    component.toggleSignup();
    expect(component.showWelcome).toBe(true);

    component.toggleSignup();
    expect(component.showWelcome).toBe(false);
  });

  /**
   * 🧪 TEST #5 : login() doit gérer le cas utilisateur non vérifié
   */
  it('should handle non-verified user correctly', () => {
    const mockUserResponse = {
      authenticated: true,
      user: {
        id: '00000000-0000-0000-0000-000000000001',
        email: 'test@gmail.com',
        isVerified: false,
        roles: ['ROLE_USER'],
        consentRgpd: true
      }
    };

    authService.login.and.returnValue(of({ token: 'fake-jwt-token' }));
    authService.me.and.returnValue(of(mockUserResponse));

    component.email = 'test@gmail.com';
    component.password = 'pass123';
    component.login();

    expect(component.notVerifiedMessage)
      .toContain('confirmer votre email');

    expect(component.showResendButton).toBeTrue();
    // removeToken n'existe plus — le cookie est supprimé côté serveur via POST /api/logout
  });


  /**
   * 🧪 TEST #6 : googleLogin() doit appeler authService.googleLogin()
   */
  it('should call googleLogin when Google button is clicked', () => {
    component.googleLogin();
    expect(authService.googleLogin).toHaveBeenCalled();
  });
});