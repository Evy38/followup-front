import { Component, inject, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent implements OnInit {
  private auth = inject(AuthService);

  email = 'test@example.com';
  password = 'test1234';
  message = '';
  loading = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    // ✅ Seulement côté navigateur
    if (isPlatformBrowser(this.platformId)) {
      this.setVH();
      window.addEventListener('resize', () => this.setVH());
    }
  }

  private setVH() {
    // ✅ Double protection
    if (isPlatformBrowser(this.platformId) && typeof window !== 'undefined') {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
  }

  login() {
    this.loading = true;
    this.message = '';
    
    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        this.message = 'Connexion réussie 🎉';
        this.loading = false;
        console.log('✅ Token reçu :', res);
      },
      error: (err) => {
        this.message = 'Identifiants invalides ❌';
        this.loading = false;
        console.error('❌ Erreur de connexion:', err);
      }
    });
  }

  goToRegister() {
    console.log('Redirection vers inscription');
  }
}