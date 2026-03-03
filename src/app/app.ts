import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { SpinnerComponent } from "./service/spinner/spinner-component";
import { TranslateService } from '@ngx-translate/core';
import { ThemePreferenceService } from './service/theme-preference/theme-preference-service';
import { Constants } from './constants';
import { ToastModule, Toast } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Navbar,
    SpinnerComponent,
    Toast
],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private translate = inject(TranslateService);
  private themePreference = inject(ThemePreferenceService);

  protected readonly title = signal('ISDox-front');

  constructor() {
    this.initializeLanguages();
    this.setPreferedLanguage();

    this.themePreference.initializeTheme();
  }

  private initializeLanguages() {
    this.translate.addLangs(Constants.availableLanguages);
    this.translate.setFallbackLang('en-US');
  }

  private setPreferedLanguage() {
    var preferedLanguage = localStorage.getItem('ISDox_lang');
    if (preferedLanguage == null) {
      var fallbackLang = this.translate.getFallbackLang() ?? Constants.fallbackLanguage;
      localStorage.setItem('ISDox_lang', fallbackLang);
      this.translate.use(fallbackLang);
      return;
    }
    this.translate.use(preferedLanguage);
  }
}
