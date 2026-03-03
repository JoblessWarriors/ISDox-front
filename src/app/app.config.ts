import { APP_INITIALIZER, ApplicationConfig, inject, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';
import {provideTranslateHttpLoader} from "@ngx-translate/http-loader";
import { RouteTranslationService } from './service/route-translation/route-translation-service';
import { Constants } from './constants';
import { MessageService } from 'primeng/api';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';


export function initializeAppLocale() {
  const service = inject(RouteTranslationService);
  const router = inject(Router);
  
  return async () => {
    await service.initialize();

    var lang = localStorage.getItem('ISDox_lang') ?? Constants.fallbackLanguage;
    const dynamicRoutes = service.getRoutesForLanguage(lang);

    router.resetConfig([
      ...dynamicRoutes
      
    ]);
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
    provideBrowserGlobalErrorListeners(),
    provideRouter([]),
    provideAnimationsAsync(),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAnalytics(() => getAnalytics()),
    ScreenTrackingService, 
    UserTrackingService,
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
      fallbackLang: Constants.fallbackLanguage
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppLocale,
      multi: true
    }
  ]
};
