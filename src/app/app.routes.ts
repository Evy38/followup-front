import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout';
import { PrivateLayoutComponent } from './layouts/private-layout/private-layout';
import { GoogleCallbackComponent } from './features/auth/google-callback/google-callback.component';

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
          import('./features/public/home/home').then(m => m.HomeComponent),
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./features/public/about/about').then(m => m.AboutComponent),
      },
      {
        path: 'features',
        loadComponent: () =>
          import('./features/public/features/features').then(m => m.FeaturesComponent),
      },
      {
        path: 'pricing',
        loadComponent: () =>
          import('./features/public/pricing/pricing').then(m => m.PricingComponent),
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
          import('./features/dashboard/dashboard.component').then(
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
    loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent),
  },
  {
    path: 'forgot-password',
    outlet: 'overlay',
    loadComponent: () => import('./features/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
  },

  // Route de callback Google OAuth (pas d'outlet)
  {
    path: 'google-callback',
    component: GoogleCallbackComponent,
  },

  // fallback
  { path: '**', redirectTo: '' },
];