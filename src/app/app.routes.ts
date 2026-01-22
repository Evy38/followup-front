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
      {
        path: 'verify-email',
        loadComponent: () =>
          import('./features/auth/verify-email/verify-email.component')
            .then(m => m.VerifyEmailComponent),
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
          import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        data: { topbar: 'dashboard' }
      },
      {
        path: 'candidatures',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/dashboard/candidatures.component').then(m => m.CandidaturesComponent),
        data: { topbar: 'candidatures' }
      },
      {
        path: 'annonces',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/dashboard/annonces.component').then(m => m.AnnoncesComponent),
        data: { topbar: 'annonces' }
      },
      {
        path: 'relances',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/dashboard/relances.component').then(m => m.RelancesComponent),
        data: { topbar: 'dashboard' } // tu ajusteras quand tu voudras une topbar dédiée
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
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./features/auth/reset-password/reset-password.component')
        .then(m => m.ResetPasswordComponent),
  },


  // Route de callback Google OAuth (pas d'outlet)
  {
    path: 'google-callback',
    component: GoogleCallbackComponent,
  },

  // fallback
  { path: '**', redirectTo: '' },
];