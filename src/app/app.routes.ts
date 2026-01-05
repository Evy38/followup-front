import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { PublicLayoutComponent } from './layout/public-layout/public-layout';
import { PrivateLayoutComponent } from './layout/private-layout/private-layout';
import { GoogleCallbackComponent } from './pages/auth/google-callback/google-callback.component';

export const routes: Routes = [
  // ============================
  // ZONE PUBLIQUE
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

  // ============================
  // ZONE PRIVEE
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

  // ============================
  // OVERLAY AUTH (router-outlet secondaire)
  // ============================
  {
    path: 'login',
    outlet: 'overlay',
    loadComponent: () => import('./pages/auth/login/login').then(m => m.LoginComponent),
  },
  {
    path: 'forgot-password',
    outlet: 'overlay',
    loadComponent: () => import('./pages/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
  },

  // Route de callback Google OAuth (pas d'outlet)
  {
    path: 'google-callback',
    component: GoogleCallbackComponent,
  },

  // fallback
  { path: '**', redirectTo: '' },
];
