import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [

  // Page de connexion
  {
    path: '',
    loadComponent: () =>
      import('./pages/login/login').then(m => m.LoginComponent),
  },

  // Dashboard sécurisé
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component')
        .then(m => m.DashboardComponent),
  },
];
