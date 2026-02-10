import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-finalize-signup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './finalize-signup.component.html',
  styleUrls: ['./finalize-signup.component.css'],
})
export class FinalizeSignupComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  consentRgpd = false;
  error = '';
  loading = false;

  submit(): void {
    if (!this.consentRgpd) {
      this.error =
        'Vous devez accepter la politique de confidentialité pour continuer.';
      return;
    }

    this.loading = true;
  }
}
