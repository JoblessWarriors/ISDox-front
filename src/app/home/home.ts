import { Component, inject, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { PageEnum } from '../enums/page-enum';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { SpinnerService } from '../service/spinner/spinner-service';

@Component({
  selector: 'app-home',
  imports: [
    ButtonModule,
    CardModule,
    DividerModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit{
  private cookieService = inject(CookieService);
  private translate = inject(TranslateService);
  private spinnerService = inject(SpinnerService);

  protected welcomeTitle: string = '';
  protected welcomeSubtitle: string = '';
  protected whatIsTitle: string = '';
  protected whatIsText: string = '';
  protected whyUseTitle: string = '';
  protected mitLicenseLabel: string = '';
  protected sectionTitle: string = '';
  protected sectionSubtitle: string = '';

  protected teamMembers: any[] = [];
  protected features: { title: string, desc: string, icon: string }[] = [];

  ngOnInit(): void {
    this.cookieService.set('ISDox_lastVisitedPage', PageEnum.HOME, 
      { path: '/', sameSite: 'Strict' });
    this.spinnerService.show();
    this.updateLabels();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateLabels();
    });
  }

  private updateLabels() {
    this.welcomeTitle = this.translate.instant('home.welcome-title');
    this.welcomeSubtitle = this.translate.instant('home.welcome-subtitle');
    this.whatIsTitle = this.translate.instant('home.what-is-title');
    this.whatIsText = this.translate.instant('home.what-is-text');
    this.whyUseTitle = this.translate.instant('home.why-use-title');
    this.mitLicenseLabel = this.translate.instant('home.mit-license');

    this.features = [
      { 
        title: this.translate.instant('home.feature-1-title'), 
        desc: this.translate.instant('home.feature-1-desc'), 
        icon: 'pi pi-bolt' 
      },
      { 
        title: this.translate.instant('home.feature-2-title'), 
        desc: this.translate.instant('home.feature-2-desc'), 
        icon: 'pi pi-shield' 
      },
      { 
        title: this.translate.instant('home.feature-3-title'), 
        desc: this.translate.instant('home.feature-3-desc'), 
        icon: 'pi pi-search' 
      }
    ];

    this.sectionTitle = this.translate.instant('home.team.title');
    this.sectionSubtitle = this.translate.instant('home.team.subtitle');

    this.teamMembers = [
      {
        name: 'Frandeș Raul - Sorin',
        role: this.translate.instant('home.team.role-ceo'),
        image: 'https://pub-109f57e8159d477682c9839493bab3da.r2.dev/isdox-team-avatars/Raul.jpg'
      },
      {
        name: 'Haidamac Ioana - Paula',
        role: this.translate.instant('home.team.role-cto'),
        image: 'https://pub-109f57e8159d477682c9839493bab3da.r2.dev/isdox-team-avatars/Paula.jpg'
      },
      {
        name: 'Ion Andreea - Marina',
        role: this.translate.instant('home.team.role-architect'),
        image: 'https://pub-109f57e8159d477682c9839493bab3da.r2.dev/isdox-team-avatars/Andreea.jpg'
      }
    ];
    this.spinnerService.hide();
  }
}
