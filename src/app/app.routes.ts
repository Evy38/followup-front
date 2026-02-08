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
  // ZONE PRIVÉE (protégée par authGuard)
  // ============================
  {
    path: 'app',
    component: PrivateLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/pages/home/dashboard-home.component')
            .then(m => m.DashboardHomeComponent),
        data: { topbar: 'dashboard' }
      },
      {
        path: 'candidatures',
        loadComponent: () =>
          import('./features/dashboard/pages/candidatures/candidatures.component')
            .then(m => m.CandidaturesComponent),
        data: { topbar: 'candidatures' }
      },
      {
        path: 'annonces',
        loadComponent: () =>
          import('./features/dashboard/pages/annonces/annonces.component')
            .then(m => m.AnnoncesComponent),
        data: { topbar: 'annonces' }
      },
      {
        path: 'relances',
        loadComponent: () =>
          import('./features/dashboard/pages/relances/relances.component')
            .then(m => m.RelancesComponent),
        data: { topbar: 'relances' }
      },
    ],
  },

  // ============================
  // AUTHENTIFICATION (router-outlet secondaire "overlay")
  // ============================
  {
    path: 'login',
    outlet: 'overlay',
    loadComponent: () => 
      import('./features/auth/login/login').then(m => m.LoginComponent),
  },
  {
    path: 'forgot-password',
    outlet: 'overlay',
    loadComponent: () => 
      import('./features/auth/forgot-password/forgot-password.component')
        .then(m => m.ForgotPasswordComponent),
  },
  {
    path: 'reset-password',
    outlet: 'overlay',
    loadComponent: () =>
      import('./features/auth/reset-password/reset-password.component')
        .then(m => m.ResetPasswordComponent),
  },

  // ============================
  // CALLBACK OAUTH GOOGLE (route principale, pas d'overlay)
  // ============================
  {
    path: 'google-callback',
    component: GoogleCallbackComponent,
  },

  // ============================
  // FALLBACK (404)
  // ============================
  { 
    path: '**', 
    redirectTo: '', // ✅ Redirige vers la home publique
    pathMatch: 'full'
  },
];