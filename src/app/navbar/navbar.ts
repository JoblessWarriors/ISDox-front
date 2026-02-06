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
    this.navBarOptions = [
      {
        label: this.translate.instant('navbar.home'),
        visible: true
      },
      {
        label: this.translate.instant('navbar.profile')
      }
    ];
    this.spinnerService.hide();
  }
}
