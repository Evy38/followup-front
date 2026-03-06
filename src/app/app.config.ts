/**
 * Configuration globale de l'application Angular (standalone).
 *
 * Enregistre les providers racines :
 * - `provideZonelessChangeDetection()` — détection de changements sans Zone.js
 * - `provideRouter(routes)` — routing basé sur {@link routes}
 * - `provideHttpClient` avec les intercepteurs {@link jwtInterceptor} (injection JWT)
 *   et {@link httpErrorInterceptor} (gestion 401/403)
 * - `provideServiceWorker` — PWA activée en production uniquement
 */
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './core/auth/jwt.interceptor';
import { httpErrorInterceptor } from './core/http/http-error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([jwtInterceptor, httpErrorInterceptor])
    ),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ]
};
