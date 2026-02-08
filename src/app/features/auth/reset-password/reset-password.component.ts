import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  standalone: true,
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
  imports: [CommonModule, FormsModule],
})
export class ResetPasswordComponent implements OnInit {
  token!: string;
  newPassword = '';
  confirmPassword = '';
  error: string | null = null;
  success = false;
  submitting = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    if (!this.token) {
      this.error = 'Lien invalide ou expiré.';
    }
  }

  get passwordsMatch(): boolean {
    return this.newPassword === this.confirmPassword;
  }

  get isFormValid(): boolean {
    return (
      !!this.token &&
      this.newPassword.length >= 8 &&
      this.confirmPassword.length >= 8 &&
      this.passwordsMatch
    );
  }

  submit(): void {
    this.error = null;

    if (!this.isFormValid) {
      if (!this.passwordsMatch) {
        this.error = 'Les mots de passe ne correspondent pas.';
      } else if (this.newPassword.length < 8) {
        this.error = 'Le mot de passe doit contenir au moins 8 caractères.';
      } else {
        this.error = 'Formulaire invalide.';
      }
      return;
    }

    this.submitting = true;
    this.http.post(`${environment.apiUrl}/password/reset`, {
      token: this.token,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword
    }).subscribe({
      next: () => {
        this.success = true;
        this.newPassword = '';
        this.confirmPassword = '';
        setTimeout(() => this.router.navigate(['/']), 2000);
      },
      error: (err) => {
        this.error = err?.error?.error ?? 'Erreur lors de la réinitialisation.';
      },
      complete: () => {
        this.submitting = false;
      }
    });
  }
}
