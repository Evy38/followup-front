import { Component, Inject, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { SignupComponent } from '../signup/signup.component';
import { WelcomeComponent } from '../welcome/welcome.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SignupComponent, WelcomeComponent],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent implements OnInit {
  private auth = inject(AuthService);

  // --------- WELCOME ---------
  showWelcome = false;

  // --------- LOGIN ---------
  email = 'test@example.com';   // tu peux enlever les valeurs par défaut après tes tests
  password = 'test1234';
  loading = false;
  message = '';

  // --------- SIGNUP ---------
  showSignup = false;

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
    // Reste sur la page de connexion avec Gmail
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

  // --------- SIGNUP ---------
  closeSignup() {
    this.showSignup = false;
  }

  // --------- GOOGLE OAUTH ---------
  googleLogin() {
    this.auth.googleLogin();
  }
}
