import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'login', // ✅ Toujours rediriger vers login par défaut
    pathMatch: 'full' 
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then(m => m.LoginComponent),
  },

  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component')
        .then(m => m.DashboardComponent),
  },

  { path: '**', redirectTo: 'login' }, // ✅ Redirection vers login en cas de route inconnue
];