/**
 * Composant de connexion (overlay d'authentification).
 *
 * Affiché dans le router-outlet secondaire `overlay` sur toutes les pages.
 * Gère deux onglets : connexion par email/mot de passe et inscription.
 * Propose également la connexion via OAuth Google.
 *
 * Après une connexion réussie :
 * - Redirige l'admin vers `/app/admin/users`
 * - Redirige l'utilisateur vers `/app/dashboard`
 * - Ferme l'overlay (outlet `overlay: null`)
 */
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Component, Inject, OnInit, PLATFORM_ID, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { SignupComponent } from '../signup/signup.component';
import { WelcomeComponent } from '../welcome/welcome.component';
import { Router } from '@angular/router';
import { ToastService } from '../../../core/ui/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SignupComponent, WelcomeComponent],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent implements OnInit {
  showSignup = false;
  constructor(
    private router: Router,
    private toast: ToastService,
    @Inject(PLATFORM_ID) public platformId: Object,
    private cdr: ChangeDetectorRef
  ) { }
  private auth = inject(AuthService);
  private destroy$ = new Subject<void>();

  // --------- WELCOME ---------
  showWelcome = false;

  // --------- LOGIN ---------
  email = '';   
  password = '';
  loading = false;
  message = '';
  notVerifiedMessage: string | null = null;
  showResendButton = false;
  lastTriedEmail: string | null = null;

  ngOnInit() {
    this.auth.authError$
      .pipe(takeUntil(this.destroy$))
      .subscribe((msg) => {
        this.notVerifiedMessage = msg;
        // Affiche le bouton de renvoi UNIQUEMENT si le message correspond à l'utilisateur non vérifié
        this.showResendButton = !!msg && msg.includes('confirmer votre email');
      });

    if (isPlatformBrowser(this.platformId)) {
      this.setVH();
      window.addEventListener('resize', () => this.setVH());
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }


  private setVH() {
    if (isPlatformBrowser(this.platformId) && typeof window !== 'undefined') {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
  }

  // --------- WELCOME ---------
  toggleSignup() {
    // Au clic sur "S'inscrire", afficher la card de bienvenue
    this.showWelcome = !this.showWelcome;
    // Fermer l'inscription si elle était ouverte
    if (this.showWelcome) {
      this.showSignup = false;
    }
  }

  closeWelcome() {
    this.showWelcome = false;
  }

  onChooseGmail() {
    this.closeWelcome();
    // Démarre le login Google immédiatement
    this.googleLogin();
  }

  onChooseEmail() {
    this.closeWelcome();
    this.showSignup = true;
    // Afficher le formulaire d'inscription directement
  }

  // --------- LOGIN ---------
  login() {
    this.loading = true;
    this.message = '';

    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.auth.me().subscribe({
          next: (user: any) => {
            this.loading = false;

            // Compte marqué pour suppression → connexion refusée
            const deletionRequested = user?.user?.deletionRequestedAt ?? user?.user?.deletion_requested_at;
            if (deletionRequested) {
              this.auth.removeToken();
              this.toast.show('Ce compte a été supprimé. La connexion est impossible.', 'error');
              this.cdr.detectChanges();
              return;
            }

            if (user?.user?.isVerified === false) {
              this.notVerifiedMessage = 'Vous devez confirmer votre email, cliquez ici pour recevoir un nouveau mail de confirmation.';
              this.showResendButton = true;
              this.lastTriedEmail = this.email;
              this.auth.removeToken();
              this.cdr.detectChanges();
            } else {
              this.closeOverlay();
              setTimeout(() => {
                //Vérifier le rôle de l'utilisateur (structure variable selon la réponse)
                const roles = user?.user?.roles ?? [];
                console.log('🔍 [Login] me() response:', user);
                console.log('🔍 [Login] roles:', roles);
                const hasAdminRole = roles.includes('ROLE_ADMIN');

                if (hasAdminRole) {
                  this.router.navigate(['/app/admin/users']);  // Admin → liste des users
                } else {
                  this.router.navigate(['/app/dashboard']);     // User normal → dashboard
                }
              }, 100);
            }
          },
          error: (err) => {
            this.loading = false;
            if (err.status === 403) {
              const errMsg: string = err.error?.message ?? err.error?.error ?? '';
              if (errMsg.toLowerCase().includes('supprimé')) {
                this.auth.removeToken();
                this.toast.show('Ce compte a été supprimé. La connexion est impossible.', 'error');
                this.cdr.detectChanges();
              } else {
                this.notVerifiedMessage = 'Vous devez confirmer votre email, cliquez ici pour recevoir un nouveau mail de confirmation.';
                this.showResendButton = true;
                this.lastTriedEmail = this.email;
                this.auth.removeToken();
                this.cdr.detectChanges();
              }
            } else {
              this.message = 'Erreur lors de la vérification du compte.';
            }
          }
        });
      },
      error: () => {
        this.loading = false;
        this.message = 'Identifiants invalides ❌';
      }
    });
  }



  // --------- SIGNUP ---------
  closeSignup() {
    this.showSignup = false;
  }

  // --------- GOOGLE OAUTH ---------
  googleLogin() {
    this.auth.googleLogin();
  }

  // --------- FERMETURE DE LA CARD DE CONNEXION ---------
  closeOverlay() {
    this.auth.clearAuthError(); // 🔑 nettoyage global
    this.router.navigate([{ outlets: { overlay: null } }]);
  }


  resendVerificationEmail() {
    const emailToResend = this.lastTriedEmail || this.email;
    if (!emailToResend) {
      this.message = 'Veuillez renseigner votre email.';
      return;
    }

    this.loading = true;

    this.auth.resendVerificationEmail(emailToResend).subscribe({
      next: () => {
        this.loading = false;
        this.toast.show(
          '📧 Veuillez vérifier votre boîte mail',
          'success'
        );
      },
      error: () => {
        this.loading = false;
        this.toast.show(
          'Erreur lors de l’envoi de l’email',
          'error'
        );
      }
    });
  }


}
