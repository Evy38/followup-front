import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css',
})
export class VerifyEmailComponent implements OnInit {
  status: 'loading' | 'success' | 'error' = 'loading';
  message = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.status = 'error';
      this.message = 'Lien de validation invalide.';
      return;
    }

    this.http
      .get('http://localhost:8080/api/verify-email', {
        params: { token },
      })
      .subscribe({
        next: () => {
          this.status = 'success';
          this.message = 'Votre compte est maintenant activé.';

          // 🔴 NETTOYAGE DE L’URL (IMPORTANT)
          this.router.navigate([], {
            replaceUrl: true,
            queryParams: {},
          });
        },
        error: (err) => {
          this.status = 'error';
          this.message =
            err?.error?.error ??
            'Le lien de validation est invalide ou expiré.';
        },
      });
  }
}
