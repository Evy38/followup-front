import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, isDevMode } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './core/auth/jwt.interceptor';
import { httpErrorInterceptor } from './core/http/http-error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // global errors
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),

    // ROUTER
    provideRouter(routes),

    // HTTP
    provideHttpClient(withFetch(), withInterceptors([jwtInterceptor,httpErrorInterceptor])),

    // PWA
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ]
};
