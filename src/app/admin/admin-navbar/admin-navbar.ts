import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import {
    TranslateService,
    LangChangeEvent,
} from "@ngx-translate/core";
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MenuModule } from 'primeng/menu';
import { SpinnerService } from '../../service/spinner/spinner-service';
import { RouteTranslationService } from '../../service/route-translation/route-translation-service';
import { ThemePreferenceService } from '../../service/theme-preference/theme-preference-service';
import { FlagIconService } from '../../service/flag-icon/flag-icon';
import { UserService } from '../../service/user/user-service';
import { AuthService } from '../../service/auth/auth-service';
import { Mapper } from '../../model/mapper/mapper';
import { UserRole } from '../../model/user/user-role';
import { User } from '../../model/user/user.model';
import { Constants } from '../../constants';
import { LanguageEnum } from '../../enums/language-enum';

@Component({
  selector: 'app-admin-navbar',
  imports: [
    CommonModule,
    MenubarModule,
    AvatarModule,
    InputTextModule,
    ToggleSwitchModule,
    FormsModule,
    MenuModule
  ],
  templateUrl: './admin-navbar.html',
  styleUrl: './admin-navbar.css',
})
export class AdminNavbar {
  private translate = inject(TranslateService);
  private spinnerService = inject(SpinnerService);
  private routeTranslationService = inject(RouteTranslationService);
  private themePreferenceService = inject(ThemePreferenceService);
  private flagIconService = inject(FlagIconService);
  private location = inject(Location);
  private cookieService = inject(CookieService);
  private router = inject(Router);
  private userService = inject(UserService);
  private cd = inject(ChangeDetectorRef);
  protected authService = inject(AuthService);

  private lightLabel: string = "";
  private darkLabel: string = "";

  protected user: User | undefined;
  protected navBarOptions: MenuItem[] = [];
  protected userMenuItems: MenuItem[] = [];
  protected isDarkMode = localStorage.getItem('ISDox_user_theme') == 'light' ? false : true;
  protected modeLabel: string = "";
  protected userRoles: UserRole[] = [];

  constructor() {
  }

  ngOnInit(): void {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateMenu();
      this.cd.detectChanges()
    });

    this.authService.loggedInBehaviorSubject.subscribe((isLoggedIn) => {
      this.updateMenu(false);
      this.userService.getCurrentUser().subscribe({
        next: (userMapping) => {
          if (userMapping) {
            this.user = Mapper.map("MappingToUser", userMapping);
          }
        },
        error: (err) => {
          console.error('Failed to load current user:', err);
        }
      });
    });

    this.authService.rolesBehaviorSubject.subscribe((userRoles) => {
      this.userRoles = [...userRoles];
      this.updateMenu(false);
    });

    this.authService.currentUserRoles();
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
            },
            {
              label: this.translate.instant('languages.hu'),
                icon: 'fi fi-hu',
                command: () => {
                  this.updateLanguage(LanguageEnum.HU);
                }
            }
        ]
      }
    ];

    this.userMenuItems = [
      {
        label: this.translate.instant('navbar.logout'),
        icon: 'pi pi-sign-out',
        visible: this.authService.isLoggedIn(),
        command: () => {
          this.authService.logout();
          this.authService.currentUserRoles();
          this.routeTranslationService.getRoutesForLanguage(currentLanguage);
          var newUrls = this.routeTranslationService.getUrlsForLanguage();
          this.location.replaceState(newUrls.get('home'));
        }
      }
    ];
    this.darkLabel = this.translate.instant('navbar.dark-mode');
    this.lightLabel = this.translate.instant('navbar.light-mode');
    this.modeLabel = this.isDarkMode ? this.darkLabel : this.lightLabel;
    if (shouldTriggerReplaceState) {
      this.location.replaceState('');
    }
  }

  private updateLanguage(lang: LanguageEnum) {
    localStorage.setItem('ISDox_lang', lang);
    this.translate.use(lang);
    this.updateMenu();
  }
}
