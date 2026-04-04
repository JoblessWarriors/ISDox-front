import { Component, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import {
    TranslateService,
    LangChangeEvent,
} from "@ngx-translate/core";
import { AvatarModule } from 'primeng/avatar';
import { SpinnerService } from '../service/spinner/spinner-service';
import { InputTextModule } from 'primeng/inputtext';
import { RouteTranslationService } from '../service/route-translation/route-translation-service';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ThemePreferenceService } from '../service/theme-preference/theme-preference-service';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageEnum } from '../enums/language-enum';
import { Constants } from '../constants';
import { FlagIconService } from '../service/flag-icon/flag-icon';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../service/auth/auth-service';
import { MenuModule } from 'primeng/menu';
import { UserService } from '../service/user/user-service';
import { User } from '../model/user/user.model';
import { Mapper } from '../model/mapper/mapper';

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    MenubarModule,
    AvatarModule,
    InputTextModule,
    ToggleSwitchModule,
    FormsModule,
    MenuModule
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit{
  private translate = inject(TranslateService);
  private spinnerService = inject(SpinnerService);
  private routeTranslationService = inject(RouteTranslationService);
  private themePreferenceService = inject(ThemePreferenceService);
  private flagIconService = inject(FlagIconService);
  private location = inject(Location);
  private cookieService = inject(CookieService);
  private router = inject(Router);
  private userService = inject(UserService);
  protected authService = inject(AuthService);

  private lightLabel: string = "";
  private darkLabel: string = "";

  protected user: User | undefined;
  protected navBarOptions: MenuItem[] = [];
  protected userMenuItems: MenuItem[] = [];
  protected isDarkMode = localStorage.getItem('ISDox_user_theme') == 'light' ? false : true;
  protected modeLabel: string = "";

  constructor() {
  }

  ngOnInit(): void {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.spinnerService.show();
      this.updateMenu();
      this.spinnerService.hide();
    });

    this.authService.loggedInBehaviorSubject.subscribe((isLoggedIn) => {
      this.updateMenu(false);
      this.userService.getCurrentUser().subscribe({
        next: (userMapping) => {
          if (userMapping) {
            this.user = Mapper.map("MappingToUser", userMapping);
          }
          this.spinnerService.hide();
        },
        error: (err) => {
          console.error('Failed to load current user:', err);
          this.spinnerService.hide();
        }
      });
    });
  }

  protected toggleThemePreference() {
    this.themePreferenceService.toggleDarkMode();
    this.modeLabel = this.isDarkMode ? this.darkLabel : this.lightLabel;
  }

  private updateMenu(shouldTriggerReplaceState = true) {
    var currentLanguage = localStorage.getItem('ISDox_lang') ?? Constants.fallbackLanguage;
    this.routeTranslationService.getRoutesForLanguage(currentLanguage);
    var urls = this.routeTranslationService.getUrlsForLanguage();
    var currentFlag = this.flagIconService.getFlagByLanguage(currentLanguage as LanguageEnum) ?? 'fi fi-us';
    this.navBarOptions = [
      {
        label: this.translate.instant('navbar.home'),
        visible: true,
        url: urls.get('home')
      },
      {
        label: this.translate.instant('navbar.documents'),
        visible: this.authService.isLoggedIn(),
        url: urls.get('documents')
      },
      {
        label: this.translate.instant('navbar.archive'),
        visible: this.authService.isLoggedIn(),
        url: urls.get('archive')
      },
      {
        label: this.translate.instant('navbar.login'),
        visible: !this.authService.isLoggedIn(),
        url: urls.get('login')
      },
      {
        icon: currentFlag,
        items: [
            {
                label: this.translate.instant('languages.ro'),
                icon: 'fi fi-ro',
                command: () => {
                  this.updateLanguage(LanguageEnum.RO);
                }
            },
            {
                label: this.translate.instant('languages.en-us'),
                icon: 'fi fi-us',
                command: () => {
                  this.updateLanguage(LanguageEnum.EN_US);
                }
            }
        ]
      }
    ];

    this.userMenuItems = [
      {
        label: this.translate.instant('navbar.profile'),
        icon: 'pi pi-user',
        visible: this.authService.isLoggedIn(),
        command: () => {
          this.router.navigate([urls.get('profile')]);
        }
      },
      {
        label: this.translate.instant('navbar.logout'),
        icon: 'pi pi-sign-out',
        visible: this.authService.isLoggedIn(),
        command: () => {
          this.authService.logout();
          this.router.navigate([urls.get('home')]);
        }
      }
    ];
    this.darkLabel = this.translate.instant('navbar.dark-mode');
    this.lightLabel = this.translate.instant('navbar.light-mode');
    this.modeLabel = this.isDarkMode ? this.darkLabel : this.lightLabel;
   
    var canGetLastVisitedPageCookie = this.cookieService.check('ISDox_lastVisitedPage');
    var lastVisitedPage = canGetLastVisitedPageCookie ? 
      this.cookieService.get('ISDox_lastVisitedPage')
      : Constants.defaultPage;
    if (shouldTriggerReplaceState) {
      this.location.replaceState(urls.get(lastVisitedPage));
    }
  }

  private updateLanguage(lang: LanguageEnum) {
    localStorage.setItem('ISDox_lang', lang);
    this.translate.use(lang);
    this.spinnerService.show();
    this.updateMenu();
  }
}
