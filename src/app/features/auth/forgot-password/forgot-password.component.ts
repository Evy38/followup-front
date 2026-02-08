import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { ToastService } from '../../../core/ui/toast.service';

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
    private toast: ToastService
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

    this.auth.forgotPassword(email).subscribe({
      next: (response) => {
        this.loading = false;
        this.toast.show(
          response?.message ?? 'Email envoyé si le compte existe',
          'success'
        );
      },
      error: () => {
        this.loading = false;
        this.toast.show(
          'Impossible d’envoyer l’email',
          'error'
        );
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
