import { Component, inject, OnInit } from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import { PageEnum } from '../enums/page-enum';
import { CardModule } from 'primeng/card';
import { FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { CommonModule } from '@angular/common';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { SpinnerService } from '../service/spinner/spinner-service';

@Component({
  selector: 'app-documents',
  imports: [
    CommonModule,
    CardModule,
    FileUploadModule
  ],
  templateUrl: './documents.html',
  styleUrl: './documents.css',
})
export class Documents implements OnInit{
  private cookieService = inject(CookieService);
  private translate = inject(TranslateService);
  private spinnerService = inject(SpinnerService);

  protected titleLabel: string = '';
  protected subtitleLabel: string = '';
  protected chooseButtonLabel: string = '';
  protected uploadButtonLabel: string = '';
  protected cancelButtonLabel: string = '';
  protected attentionLabel: string = '';
  protected disclaimerLabel: string = '';

  ngOnInit(): void {
    this.cookieService.set('ISDox_lastVisitedPage', PageEnum.DOCUMENTS, 
      { path: '/', sameSite: 'Strict' });

    this.spinnerService.show();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.spinnerService.show();
      this.updateLabels();
    });

    this.updateLabels();
  }

  protected onUpload(event: FileUploadHandlerEvent) {
    console.log(event.files);
  }

  private updateLabels() {
    this.titleLabel = this.translate.instant('documents.title');
    this.subtitleLabel = this.translate.instant('documents.subtitle');
    this.chooseButtonLabel = this.translate.instant('documents.choose-button');
    this.uploadButtonLabel = this.translate.instant('documents.upload-button');
    this.cancelButtonLabel = this.translate.instant('documents.cancel-button');
    this.attentionLabel = this.translate.instant('documents.attention');
    this.disclaimerLabel = this.translate.instant('documents.disclaimer');
    this.spinnerService.hide();
  }
}

