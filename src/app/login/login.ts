import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { PasswordModule } from 'primeng/password';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { SpinnerService } from '../service/spinner/spinner-service';
import { DividerModule } from 'primeng/divider';
import { CardModule } from 'primeng/card';
import { SplitterModule } from 'primeng/splitter';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    PasswordModule,
    FloatLabelModule,
    DividerModule,
    CardModule,
    SplitterModule,
    ButtonModule,
    ImageModule
],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit{
  private translate = inject(TranslateService);
  private spinnerService = inject(SpinnerService);

  protected username: string = "";
  protected password: string = "";

  protected usernameLabel: string = "";
  protected passwordLabel: string = "";
  protected connectLabel: string = "";
  protected otherPartyConnectLabel: string = "";
  protected buttonLabel: string = "";
  protected subtitleLabel: string = "";
  protected rightPanelQuestion: string = "";
  protected rightPanelAnswer: string = "";

  ngOnInit(): void {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.spinnerService.show();
      this.updateLabels();
    });

    this.spinnerService.show();
    this.updateLabels();
  }

  private updateLabels() {
    this.usernameLabel = this.translate.instant('login.username');
    this.passwordLabel = this.translate.instant('login.password');
    this.connectLabel = this.translate.instant('login.login-message');
    this.otherPartyConnectLabel = this.translate.instant('login.login-other-options');
    this.buttonLabel = this.translate.instant('login.login-button');
    this.subtitleLabel = this.translate.instant('login.login-subtitle');
    this.rightPanelQuestion = this.translate.instant('login.right-panel-question');
    this.rightPanelAnswer = this.translate.instant('login.right-panel-answer');
    this.spinnerService.hide();
  }
}
