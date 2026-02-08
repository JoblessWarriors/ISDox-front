import { Component, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import {
    TranslateService,
    TranslatePipe,
    TranslateDirective,
    LangChangeEvent,
} from "@ngx-translate/core";
import { AvatarModule } from 'primeng/avatar';
import { SpinnerService } from '../service/spinner/spinner-service';
import { InputTextModule } from 'primeng/inputtext';
import { RouteTranslationService } from '../service/route-translation/route-translation-service';

@Component({
  selector: 'app-navbar',
  imports: [
    MenubarModule,
    AvatarModule,
    InputTextModule
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit{
  private translate = inject(TranslateService);
  private spinnerService = inject(SpinnerService);
  private routeTranslationService = inject(RouteTranslationService);

  protected navBarOptions: MenuItem[] = [];

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
    this.spinnerService.hide();
  }
}
