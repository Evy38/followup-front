/**
 * Configuration globale de l'application Angular (standalone).
 *
 * Enregistre les providers racines :
 * - `provideZonelessChangeDetection()` — détection de changements sans Zone.js
 * - `provideRouter(routes)` — routing basé sur {@link routes}
 * - `provideHttpClient` avec les intercepteurs {@link jwtInterceptor} (ajout header Authorization)
 *   et {@link httpErrorInterceptor} (gestion 401/403 : suppression, session expirée, accès refusé)
 * - `provideServiceWorker` — PWA activée en production uniquement
 */
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { credentialsInterceptor } from './core/auth/credentials.interceptor';
import { httpErrorInterceptor } from './core/http/http-error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([credentialsInterceptor, httpErrorInterceptor])
    ),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ]
};
