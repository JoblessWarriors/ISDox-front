import { APP_INITIALIZER, ApplicationConfig, inject, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';
import {provideTranslateHttpLoader} from "@ngx-translate/http-loader";
import { RouteTranslationService } from './service/route-translation/route-translation-service';

export function initializeApp() {
  const service = inject(RouteTranslationService);
  const router = inject(Router);

  return async () => {
    await service.initialize();

    var lang = localStorage.getItem('lang') ?? 'ro';
    const dynamicRoutes = service.getRoutesForLanguage(lang);

    router.resetConfig([
      ...dynamicRoutes
      
    ]);
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter([]),
    provideAnimationsAsync(),
    providePrimeNG({ 
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.dark',
        }
      }
    }),
    provideHttpClient(),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: './i18n/',
        suffix: '.json'
      }),
      fallbackLang: 'en-US'
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      multi: true
    }
  ]
};
