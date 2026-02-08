import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css',
})
export class VerifyEmailComponent implements OnInit {
  status: 'loading' | 'success' | 'error' = 'loading';
  private requestSent = false;
  message = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.requestSent) {
      return;
    }
    this.requestSent = true;

    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.status = 'error';
      this.message = 'Lien de validation invalide.';
      return;
    }

    this.http
      .get<{ message?: string }>(`${environment.apiUrl}/verify_email`, {
        params: { token }
      })
      .subscribe({
        next: (res) => {
          console.log('Réponse reçue', res);
          this.status = 'success';
          this.message = res?.message || 'Votre compte est maintenant activé.';

        },
        error: (err) => {
          console.log('Erreur reçue', err);
          this.status = 'error';
          this.message =
            err?.status === 400
              ? (err?.error?.error || err?.error?.message || 'Le lien de validation est invalide ou expiré.')
              : (err?.error?.error || err?.error?.message || 'Une erreur est survenue. Veuillez réessayer.');

        }
      });
  }

  openLoginOverlay(): void {
    this.router.navigate(
      [{ outlets: { overlay: ['login'] } }],
      { replaceUrl: false }
    );
  }

}
