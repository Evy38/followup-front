import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // ✅ Récupérer le token depuis l'URL
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.authService.handleGoogleCallback(token);
        // Nettoyer l'URL
        this.router.navigate(['/dashboard']);
      }
    });
  }
}
