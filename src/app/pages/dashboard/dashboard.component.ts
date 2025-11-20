import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (token) {
      localStorage.setItem('token', token);

      // Nettoyer l’URL
      window.history.replaceState({}, '', '/#/dashboard');
    }
  }
}
