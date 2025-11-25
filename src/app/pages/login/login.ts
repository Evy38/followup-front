import { Component, Inject, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent implements OnInit {
  private auth = inject(AuthService);

  // --------- LOGIN ---------
  email = 'test@example.com';   // tu peux enlever les valeurs par défaut après tes tests
  password = 'test1234';
  loading = false;
  message = '';

  // --------- REGISTER ---------
  showRegister = false;
  registerFirstName = '';
  registerLastName = '';
  registerEmail = '';
  registerPassword = '';
  registerConfirmPassword = '';
  registerLoading = false;
  registerMessage = '';
  registerError = '';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.setVH();
      window.addEventListener('resize', () => this.setVH());
    }
  }

  private setVH() {
    if (isPlatformBrowser(this.platformId) && typeof window !== 'undefined') {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
  }

  // --------- LOGIN ---------
  login() {
    this.loading = true;
    this.message = '';

    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.message = 'Connexion réussie 🎉';
      },
      error: (err) => {
        this.loading = false;
        this.message = 'Identifiants invalides ❌';
        console.error('Erreur de connexion:', err);
      },
    });
  }

  // --------- REGISTER ---------
  toggleRegister() {
    this.showRegister = !this.showRegister;
    this.registerMessage = '';
    this.registerError = '';
  }

  submitRegister(form: NgForm) {
    this.registerMessage = '';
    this.registerError = '';

    if (!form.valid) {
      this.registerError = 'Merci de remplir tous les champs requis.';
      return;
    }

    // Gmail obligatoire côté front aussi
    const email = this.registerEmail.trim().toLowerCase();
    if (!email.endsWith('@gmail.com')) {
      this.registerError =
        "L'adresse doit être un Gmail (ex : monjob.followup@gmail.com).";
      return;
    }

    if (this.registerPassword !== this.registerConfirmPassword) {
      this.registerError = 'Les mots de passe ne correspondent pas.';
      return;
    }

    this.registerLoading = true;

    this.auth
      .register({
        firstName: this.registerFirstName,
        lastName: this.registerLastName,
        email: email,
        password: this.registerPassword
      })
      .subscribe({
        next: () => {
          this.registerLoading = false;
          this.registerMessage =
            'Compte créé. Vous pouvez maintenant vous connecter.';

          // reset léger
          this.registerPassword = '';
          this.registerConfirmPassword = '';
        },
        error: (err: any) => {
          this.registerLoading = false;
          console.error('Erreur inscription', err);
          this.registerError =
            err?.error?.error ??
            'Erreur lors de la création du compte. Réessayez plus tard.';
        },
      });
  }

  // --------- GOOGLE OAUTH ---------
  googleLogin() {
    this.auth.googleLogin();
  }
}
