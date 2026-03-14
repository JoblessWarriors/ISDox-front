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
import { CookieService } from 'ngx-cookie-service';
import { PageEnum } from '../enums/page-enum';
import { AuthService } from '../service/auth/auth-service';
import { TokenRequest } from '../model/request/token-request.model';
import { MessageService } from 'primeng/api';
import { LogInError } from '../errors/login/log-in-error';

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
  private cookieService = inject(CookieService);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);

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

  private truthyLogInTitleLabel: string = "";
  private faultyLogInTitleLabel: string = '';
  private faultyLogInMessageLabel: string = '';

  ngOnInit(): void {
    this.cookieService.set('ISDox_lastVisitedPage', PageEnum.LOGIN, 
      { path: '/', sameSite: 'Strict' });
      
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.spinnerService.show();
      this.updateLabels();
    });

    this.spinnerService.show();
    this.updateLabels();
  }

  protected logIn() {
    const logInRequest = {
      email: this.username,
      password: this.password
    } as TokenRequest;
    this.authService.login(logInRequest).subscribe({
      next: (response) => {
        if (response.token && response.expiresIn) {
          const expirationDate = new Date(Date.now() + response.expiresIn);

          this.cookieService.set('ISDox_access_token', response.token, 
            { expires: expirationDate, 
              path: '/',
              sameSite: 'Strict'});
          this.messageService.add({ severity: 'success', summary: this.truthyLogInTitleLabel });
          this.authService.isAdmin();
        }
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: this.faultyLogInTitleLabel , detail: this.faultyLogInMessageLabel });
        // TBA: Log instead of throwing
        throw new LogInError(err.error.error);
      }
    });
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
    this.truthyLogInTitleLabel = this.translate.instant('login.truthy-login-title');
    this.faultyLogInMessageLabel = this.translate.instant('login.faulty-login-message');
    this.faultyLogInTitleLabel = this.translate.instant('login.faulty-login-title');
    this.spinnerService.hide();
  }
}
