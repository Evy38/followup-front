import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  email = '';
  loading = false;
  message = '';
  error = '';

  constructor(

    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  submit(form: NgForm) {
    this.message = '';
    this.error = '';

    if (!form.valid) {
      this.error = 'Merci de saisir une adresse email.';
      return;
    }

    const email = this.email.trim().toLowerCase();
    this.loading = true;
    console.log('🚀 Envoi de la requête forgot password pour:', email);

    this.auth.forgotPassword(email).subscribe({
      next: (response) => {
        console.log('✅ Réponse reçue:', response);
        this.loading = false;
        this.message = response?.message || 'Si un compte existe pour cet email, un lien de réinitialisation a été envoyé.';
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('❌ Erreur reçue:', err);
        this.loading = false;
        this.error = err?.error?.error ?? "Impossible d'envoyer l'email de réinitialisation pour le moment.";
        this.cdr.markForCheck();
      },
      complete: () => {
        console.log('🏁 Observable complete');
      }
    });
  }

  backToLogin() {
    this.router.navigate([{ outlets: { overlay: ['login'] } }]);
  }

  // --------- FERMETURE DE LA CARD DE CONNEXION ---------
  closeOverlay() {
  this.router.navigate([{ outlets: { overlay: null } }]);
}
}
