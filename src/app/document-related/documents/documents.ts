import { Component, inject, OnInit } from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import { CardModule } from 'primeng/card';
import { FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { CommonModule } from '@angular/common';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { SpinnerService } from '../../service/spinner/spinner-service';
import { PageEnum } from '../../enums/page-enum';
import { Dossier } from '../../model/dossier/dossier.model';
import { DossierService } from '../../service/dossier/dossier-service';
import { Mapper } from '../../model/mapper/mapper';
import { MessageService } from 'primeng/api';
import { ChooseDossierDialog } from '../choose-dossier-dialog/choose-dossier-dialog';
import { ConfirmDocument } from '../confirm-document/confirm-document';

@Component({
  selector: 'app-documents',
  imports: [
    CommonModule,
    CardModule,
    FileUploadModule,
    ChooseDossierDialog,
    ConfirmDocument
  ],
  templateUrl: './documents.html',
  styleUrl: './documents.css',
})
export class Documents implements OnInit{
  private cookieService = inject(CookieService);
  private translate = inject(TranslateService);
  private spinnerService = inject(SpinnerService);
  private dossierService = inject(DossierService);
  private messageService = inject(MessageService);

  protected openChooseDossierSelection: boolean = false;
  protected openConfirmDocument: boolean = false;
  protected selectedDossier?: Dossier = undefined;
  protected file?: File  = undefined;

  protected titleLabel: string = '';
  protected subtitleLabel: string = '';
  protected chooseButtonLabel: string = '';
  protected uploadButtonLabel: string = '';
  protected cancelButtonLabel: string = '';
  protected attentionLabel: string = '';
  protected disclaimerLabel: string = '';
  protected titleDossierLabel: string = '';
  protected subtitleDossierLabel: string = '';
  protected createDossierButtonLabel: string = '';
  protected chooseDossierButtonLabel: string = '';
  protected createDossierSubtitleLabel: string = '';
  protected chooseDossierSubtitleLabel: string = '';
  protected faultyCreateDossierTitleLabel: string = '';
  protected faultyCreateDossierDetailsLabel: string = '';

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
    this.file = event.files[0];
    this.openConfirmDocument = true;
  }

  protected createNewDossier() {
    this.spinnerService.show();
    this.dossierService.createDossier().subscribe({
      next: (response) => {
        if (response) {
          let dossier = Mapper.map("MappingToDossier", response) as Dossier;
          this.selectedDossierEvent(dossier);
        }
      },
      error: (err) => {
        console.error('Failed to create user:', err);
        this.spinnerService.hide();
        this.messageService.add({ severity: 'error', summary: this.faultyCreateDossierTitleLabel , detail: this.faultyCreateDossierDetailsLabel });
      },
      complete: () => {
        this.spinnerService.hide();
      }
    });
  }

  protected chooseExistingDossier() {
    this.openChooseDossierSelection = true;
  }

  protected selectedDossierEvent(dossier: Dossier) {
    this.selectedDossier = { ... dossier};
    this.subtitleLabel = this.subtitleLabel.replace(/{id}/g, this.selectedDossier.id);
  }

  private updateLabels() {
    this.titleLabel = this.translate.instant('documents.title');
    this.subtitleLabel = this.translate.instant('documents.subtitle');
    if (this.selectedDossier !== undefined) {
      this.subtitleLabel = this.subtitleLabel.replace(/{id}/g, this.selectedDossier.id);
    }
    this.chooseButtonLabel = this.translate.instant('documents.choose-button');
    this.uploadButtonLabel = this.translate.instant('documents.upload-button');
    this.cancelButtonLabel = this.translate.instant('documents.cancel-button');
    this.attentionLabel = this.translate.instant('documents.attention');
    this.disclaimerLabel = this.translate.instant('documents.disclaimer');
    this.titleDossierLabel= this.translate.instant('documents.title-dossier');
    this.subtitleDossierLabel = this.translate.instant('documents.subtitle-dossier');
    this.createDossierButtonLabel = this.translate.instant('documents.create-dossier-button');
    this.chooseDossierButtonLabel = this.translate.instant('documents.choose-dossier-button');
    this.createDossierSubtitleLabel = this.translate.instant('documents.create-dossier-subtitle');
    this.chooseDossierSubtitleLabel = this.translate.instant('documents.choose-dossier-subtitle');
    this.faultyCreateDossierTitleLabel = this.translate.instant('documents.faulty-create-dossier-title');
    this.faultyCreateDossierDetailsLabel = this.translate.instant('documents.faulty-create-dossier-details');
    this.spinnerService.hide();
  }
}

