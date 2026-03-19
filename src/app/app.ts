import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { SpinnerComponent } from "./service/spinner/spinner-component";
import { TranslateService } from '@ngx-translate/core';
import { ThemePreferenceService } from './service/theme-preference/theme-preference-service';
import { Constants } from './constants';
import { ToastModule, Toast } from 'primeng/toast';
import { AuthService } from './service/auth/auth-service';
import { UserService } from './service/user/user-service';
import { User } from './model/user/user.model';
import { NormalLayout } from './layouts/normal-layout/normal-layout';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { AdminHomepage } from "./admin/admin-homepage/admin-homepage";
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';

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
    this.authService.adminBehaviorSubject.subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
    });

    this.authService.isAdmin();
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

  private isAdminMethod() {
    var hei = this.cookieService.check('ISDox_access_token');
    var hei2 = this.getCookie('ISDox_access_token')
  }

  private getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }
}
