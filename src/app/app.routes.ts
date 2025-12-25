import { Routes } from '@angular/router';

import { authGuard } from './guards/auth.guard';

// layouts
import { PublicLayoutComponent } from './layout/public-layout/public-layout';
import { PrivateLayoutComponent } from './layout/private-layout/private-layout';

export const routes: Routes = [

  // ============================
  // 🔹 ZONE PUBLIQUE
  // ============================
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home/home/home').then(m => m.Home),
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./pages/home/about/about').then(m => m.About),
      },
      {
        path: 'features',
        loadComponent: () =>
          import('./pages/home/features/features').then(m => m.Features),
      },
      {
        path: 'pricing',
        loadComponent: () =>
          import('./pages/home/pricing/pricing').then(m => m.Pricing),
      },
    ],
  },

  // Auth routes sans navbar
  {
    path: '',
    component: (await import('./layout/auth-layout/auth-layout')).AuthLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./pages/auth/login/login').then(m => m.LoginComponent),
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./pages/auth/forgot-password/forgot-password.component').then(
            m => m.ForgotPasswordComponent
          ),
      },
    ],
  },

  // ============================
  // 🔒 ZONE PRIVÉE
  // ============================
  {
    path: '',
    component: PrivateLayoutComponent,
    children: [
      {
        path: 'dashboard',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then(
            m => m.DashboardComponent
          ),
      },
    ],
  },

  // fallback
  { path: '**', redirectTo: '' },
];
