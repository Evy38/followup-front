import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-google-callback',
  standalone: true,
  template: `<div class="google-callback">Connexion Google en cours...</div>`,
})
export class GoogleCallbackComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    
    if (token) {
      this.auth.handleGoogleCallback(token);

      this.auth.me().subscribe({
        next: (res: any) => {
          const roles = res?.user?.roles ?? res?.roles ?? [];
          const isAdmin = roles.includes('ROLE_ADMIN');

          this.router.navigate(
            [
              {
                outlets: {
                  primary: ['app', isAdmin ? 'admin' : 'dashboard', isAdmin ? 'users' : undefined].filter(Boolean),
                  overlay: null
                }
              }
            ]
          );
        },
        error: () => {
          this.router.navigate([{ outlets: { overlay: ['login'] } }]);
        }
      });

    } else {
      // Pas de token, retour à la page de login
      this.router.navigate(['/login']);
    }
  }
}