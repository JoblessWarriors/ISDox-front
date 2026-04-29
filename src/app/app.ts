import { Component, inject, OnInit, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ThemePreferenceService } from './service/theme-preference/theme-preference-service';
import { Constants } from './constants';
import { AuthService } from './service/auth/auth-service';
import { NormalLayout } from './layouts/normal-layout/normal-layout';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { UserRole } from './model/user/user-role';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    NormalLayout,
    AdminLayout
],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private translate = inject(TranslateService);
  private themePreference = inject(ThemePreferenceService);
  private cookieService = inject(CookieService);
  private authService = inject(AuthService);

  protected readonly title = signal('ISDox-front');
  protected isAdmin: boolean = false;

  constructor() {
    
  }

  ngOnInit(): void {
    this.initializeLanguages();
    this.setPreferedLanguage();

    this.themePreference.initializeTheme();
    this.authService.rolesBehaviorSubject.subscribe((userRoles) => {
      this.isAdmin = userRoles.includes(UserRole.INSTITUTION_ADMIN);
    });

    this.authService.currentUserRoles();
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
