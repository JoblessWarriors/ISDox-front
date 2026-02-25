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

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    MenubarModule,
    AvatarModule,
    InputTextModule,
    ToggleSwitchModule,
    FormsModule
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

  private lightLabel: string = "";
  private darkLabel: string = "";

  protected navBarOptions: MenuItem[] = [];
  protected isDarkMode = localStorage.getItem('user-theme') == 'light' ? false : true;
  protected modeLabel: string = "";

  constructor() {
  }

  ngOnInit(): void {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.spinnerService.show();
      this.updateMenu();
    });
    this.spinnerService.show();
    this.updateMenu();
  }

  protected toggleThemePreference() {
    this.themePreferenceService.toggleDarkMode();
    this.modeLabel = this.isDarkMode ? this.darkLabel : this.lightLabel;
  }

  private updateMenu() {
    var currentLanguage = localStorage.getItem('lang') ?? Constants.fallbackLanguage;
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
        url: urls.get('documents')
      },
      {
        label: this.translate.instant('navbar.archive'),
        url: urls.get('archive')
      },
      {
        label: this.translate.instant('navbar.login'),
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
    this.darkLabel = this.translate.instant('navbar.dark-mode');
    this.lightLabel = this.translate.instant('navbar.light-mode');
    this.modeLabel = this.isDarkMode ? this.darkLabel : this.lightLabel;
   
    var lastVisitedPage = this.cookieService.get('lastVisitedPage') ?? 'home';
    this.location.replaceState(urls.get(lastVisitedPage));
    this.spinnerService.hide();
  }

  private updateLanguage(lang: LanguageEnum) {
    localStorage.setItem('lang', lang);
    this.translate.use(lang);
    this.spinnerService.show();
    this.updateMenu();
  }
}
