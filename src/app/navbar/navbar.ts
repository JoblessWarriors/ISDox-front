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
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  private lightLabel: string = "";
  private darkLabel: string = "";

  protected navBarOptions: MenuItem[] = [];
  protected isDarkMode = localStorage.getItem('user-theme') == 'light' ? false : true;
  protected modeLabel: string = "";

  constructor() {
    this.spinnerService.show();
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
    var urls = this.routeTranslationService.getUrlsForLanguage();
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
    ];
    this.darkLabel = this.translate.instant('navbar.dark-mode');
    this.lightLabel = this.translate.instant('navbar.light-mode');
    this.modeLabel = this.isDarkMode ? this.darkLabel : this.lightLabel;
    this.spinnerService.hide();
  }
}
