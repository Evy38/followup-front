import { Component, Input, Output, EventEmitter, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  private auth = inject(AuthService);
  protected router = inject(Router);

  @Input() isVisible = false;
  @Output() closeSignup = new EventEmitter<void>();

  // --------- REGISTER ---------
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';
  loading = false;
  message = '';
  error = '';

  toggleSignup() {
    this.closeSignup.emit();
    this.resetForm();
  }

  submitRegister(form: NgForm) {
    this.message = '';
    this.error = '';

    if (!form.valid) {
      this.error = 'Merci de remplir tous les champs requis.';
      return;
    }

    // Gmail obligatoire côté front aussi
    const emailTrimmed = this.email.trim().toLowerCase();
    if (!emailTrimmed.endsWith('@gmail.com')) {
      this.error =
        "L'adresse doit être un Gmail (ex : monjob.followup@gmail.com).";
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Les mots de passe ne correspondent pas.';
      return;
    }

    this.loading = true;

    this.auth
      .register({
        firstName: this.firstName,
        lastName: this.lastName,
        email: emailTrimmed,
        password: this.password
      })
      .subscribe({
        next: () => {
          this.loading = false;
          this.message =
            'Compte créé. Vous pouvez maintenant vous connecter.';

          // reset du formulaire
          this.resetForm();
          
          // Fermer le formulaire après 2 secondes
          setTimeout(() => {
            this.closeSignup.emit();
          }, 2000);
        },
        error: (err: any) => {
          this.loading = false;
          console.error('Erreur inscription', err);
          this.error =
            err?.error?.error ??
            'Erreur lors de la création du compte. Réessayez plus tard.';
        },
      });
  }

  private resetForm() {
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
  }
    closeOverlay() {
  this.router.navigate([{ outlets: { overlay: null } }]);
}
}
