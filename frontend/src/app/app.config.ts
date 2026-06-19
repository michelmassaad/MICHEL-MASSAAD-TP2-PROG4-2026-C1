import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { PreloadAllModules, provideRouter, withComponentInputBinding,
         withInMemoryScrolling, withPreloading } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
      withComponentInputBinding(),
      withPreloading(PreloadAllModules),
    ),
    // Sin archivo interceptor separado — una línea inline
    provideHttpClient(
      withFetch(),
      withInterceptors([
        (req, next) => next(req.clone({ withCredentials: true })),
      ]),
    ),
  ],
};