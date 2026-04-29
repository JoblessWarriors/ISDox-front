import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Constants } from '../../constants';
import { Routes } from '@angular/router';
import { loggedInGuardGuard } from '../../guards/logged-in/logged-in-guard-guard';

@Injectable({
  providedIn: 'root',
})

export class RouteTranslationService {
  private http = inject(HttpClient);

  private routeMaps: Record<string, Record<string, string>> = {};

  private availableLangs = Constants.availableLanguages;
  private availableEndpoints = Constants.availableEndpoints;
  private endpointComponentMapping = Constants.endpointComponentMapping;
  private endpointLoggedInGuardMapping = Constants.endpointLoggedInGuardMapping;

  private currentLanguageUrls = new Map();

  async initialize(): Promise<void> {
    const loadTasks = this.availableLangs.map(async (lang) => {
      try {
        const data = await firstValueFrom(this.http.get<any>(`./i18n/${lang}.json`));
        this.routeMaps[lang] = data.routes || {};
      } catch (e) {
        console.error(`Failed to load routes for ${lang}`, e);
        this.routeMaps[lang] = {};
      }
    });
    await Promise.all(loadTasks);
  }

  getRoutesForLanguage(lang: string): Routes {
    this.currentLanguageUrls = new Map();
    var routes: Routes = [];
    var redirectTo = new Map();
    const currentLanguageData = this.routeMaps[lang];

    var otherLanguages = this.availableLangs.filter(x => x !== lang);

    this.availableEndpoints.forEach((endpoint) => {
      var currentEndpoint = `${lang}/${currentLanguageData[endpoint]}`
      this.currentLanguageUrls.set(endpoint, currentEndpoint);
      var canActivateFuncs = [];
      if (this.endpointLoggedInGuardMapping.get(endpoint)) {
        canActivateFuncs.push(loggedInGuardGuard);
      }
      routes.push({
        path: currentEndpoint,
        component: this.endpointComponentMapping.get(endpoint),
        canActivate: canActivateFuncs.length > 0 ? canActivateFuncs : undefined
      });
      redirectTo.set(endpoint, currentEndpoint);

      otherLanguages.forEach((otherLang) => {
        var otherLanguageData = this.routeMaps[otherLang];
        routes.push({
          path: `${otherLang}/${otherLanguageData[endpoint]}`,
          redirectTo: currentEndpoint
        });
      });
    });

    const defaultPath = currentLanguageData[Constants.defaultPage] ? `${lang}/${currentLanguageData[Constants.defaultPage]}` : `${lang}/home`;
    routes.push({ path: '', redirectTo: defaultPath, pathMatch: 'full' });
    routes.push({ path: '**', redirectTo: defaultPath });
    return routes;
  }

  getUrlsForLanguage() {
    return this.currentLanguageUrls;
  }
}
