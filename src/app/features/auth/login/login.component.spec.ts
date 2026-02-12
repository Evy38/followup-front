import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login';
import { AuthService } from '../../../core/auth/auth.service';
import { ToastService } from '../../../core/ui/toast.service';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login', 'me', 'removeToken', 'clearAuthError', 'googleLogin']);
    authSpy.authError$ = of(null);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, HttpClientTestingModule, RouterTestingModule, FormsModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        ToastService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call login on form submit', () => {
    const mockUser = { authenticated: true, user: { id: 1, isVerified: true, roles: [] } };
    authService.login.and.returnValue(of({ token: 'fake-token' }));
    authService.me.and.returnValue(of(mockUser));

    component.email = 'test@test.com';
    component.password = 'pass123';
    component.login();

    expect(authService.login).toHaveBeenCalledWith('test@test.com', 'pass123');
  });

  it('should display error on invalid credentials', () => {
    authService.login.and.returnValue(throwError(() => new Error('Invalid')));

    component.login();

    expect(component.loading).toBe(false);
    expect(component.message).toContain('Identifiants invalides');
  });

  it('should toggle signup form', () => {
    expect(component.showWelcome).toBe(false);
    component.toggleSignup();
    expect(component.showWelcome).toBe(true);
  });
});

