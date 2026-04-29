import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { GalleriaModule } from 'primeng/galleria';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { DossierService } from '../../service/dossier/dossier-service';
import { SpinnerService } from '../../service/spinner/spinner-service';
import { MessageService } from 'primeng/api';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { FraudRiskLevel } from '../../model/document/fraud-risk-level';
import { Document } from '../../model/document/document.model';
import { Dossier } from '../../model/dossier/dossier.model';
import { DocumentService } from '../../service/document/document-service';
import { DocumentType } from '../../model/document/document-type.model';
import { DocumentTypeService } from '../../service/document-type/document-type-service';
import { forkJoin } from 'rxjs';
import { DossierStatus } from '../../model/dossier/dossier-status';

@Component({
  selector: 'app-solve-dossier-dialog',
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    SelectModule,
    ButtonModule,
    GalleriaModule,
    DividerModule,
    TagModule
  ],
  templateUrl: './solve-dossier-dialog.html',
  styleUrl: './solve-dossier-dialog.css',
})
export class SolveDossierDialog {
  @Input() dossier?: Dossier;
  @Input() isVisible = false;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() solvedDossierEmitter: EventEmitter<string> = new EventEmitter<string>();

  private dossierService = inject(DossierService);
  private cd = inject(ChangeDetectorRef);
  private spinnerService = inject(SpinnerService);
  private messageService = inject(MessageService);
  private documentService = inject(DocumentService);
  private documentTypeService = inject(DocumentTypeService);
  protected translate = inject(TranslateService);

  protected isUploading: boolean = false;
  protected isResponseUploaded: boolean = false;

  protected FraudRiskLevel = FraudRiskLevel;
  protected activeIndex: number = 0;
  protected activeDocument?: Document;
  protected documentTypes: DocumentType[] = [];
  protected selectedDocumentType: DocumentType | null = null;

  protected titleLabel: string = '';
  protected descriptionLabel: string = '';
  protected documentDetailsLabel: string = '';
  protected documentFilenameLabel: string = '';
  protected documentFraudRiskLabel: string = '';
  protected documentPageCountLabel: string = '';
  protected documentExtractedTextLabel: string = '';
  protected documentMetadataLabel: string = '';
  protected discardButtonLabel: string = '';
  protected submitButtonLabel: string = '';
  protected mandatoryUploadDisclaimerLabel: string = '';
  protected uploadResponseLabel: string = '';
  protected uploadButtonLabel: string = '';
  protected uploadSuccessTitleLabel: string = '';
  protected uploadSuccessDetailsLabel: string = '';
  protected documentTypeLabel: string = '';
  protected documentTypePlaceholderLabel: string = '';
  protected selectTypeFirstErrorLabel: string = '';
  private faultyGetDocumentUrlsTitleLabel: string = '';
  private faultyGetDocumentUrlsDetailsLabel: string = '';
  private faultyUploadDocumentResponseTitleLabel: string = '';
  private faultyUploadDocumentResponseDetailsLabel: string = '';
  private faultySolveDossierTitleLabel: string = '';
  private faultySolveDossierDetailsLabel: string = '';

  responsiveOptions: any[] = [
    { breakpoint: '1024px', numVisible: 5 },
    { breakpoint: '768px', numVisible: 3 }
  ];

  ngOnInit() {
    this.updateLabels();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateLabels();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.dossier !== undefined) {
      this.spinnerService.show();
      this.selectedDocumentType = null;
      forkJoin({
        urls: this.dossierService.getAllDocumentUrls(this.dossier.id),
        types: this.documentTypeService.getAllDocumentTypes()
      }).subscribe({
        next: (result) => {
          if (result.urls) {
            this.dossier!.documents.forEach((doc) => {
              doc.firstPageUrl = result.urls[doc.id];
            });
          }
          if (result.types) {
            this.documentTypes = [...result.types];
          }
          this.cd.detectChanges();
          this.spinnerService.hide();
        },
        error: (err) => {
          console.error('Initialization failed:', err);
          this.spinnerService.hide();
          
          this.messageService.add({ 
            severity: 'error', 
            summary: this.faultyGetDocumentUrlsTitleLabel, 
            detail: this.faultyGetDocumentUrlsDetailsLabel
          });
        }
      });
    }
    
    if (this.dossier!.documents?.length > 0) {
      this.activeDocument = this.dossier!.documents[0];
    }
  }

  protected onImageChange(index: number) {
    this.activeIndex = index;
    this.activeDocument = this.dossier!.documents[index];
  }

  protected submitDossier() {
    if (this.isResponseUploaded && this.dossier) {
      this.dossierService.patchDossier(this.dossier.id, DossierStatus[DossierStatus.SOLVED]).subscribe({
        next: (result) => {
          if (result) {
            this.solvedDossierEmitter.emit(this.dossier!.id);
            this.onCloseModal();
          }
        },
        error: (err) => {
          console.error('Solving dossier failed:', err);
          
          this.messageService.add({ 
            severity: 'error', 
            summary: this.faultySolveDossierTitleLabel, 
            detail: this.faultySolveDossierDetailsLabel
          });
        }
      });
    }
  }

  protected onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file && this.selectedDocumentType) {
      this.isUploading = true;
      this.documentService.uploadDocument(this.dossier!.id, file, this.selectedDocumentType!.id).subscribe({
          next: (res) => {
            this.isUploading = false;
            this.isResponseUploaded = true;
          },
          error: () => {
            this.isUploading = false;
            this.messageService.add({ 
              severity: 'error', 
              summary: this.faultyUploadDocumentResponseTitleLabel, 
              detail: this.faultyUploadDocumentResponseDetailsLabel });
          }
      });
    }
  }

  protected onCloseModal() {
    this.closeModal.emit(false);
    this.dossier = undefined;
  }

  private updateLabels(): void {
    // Main View Labels
    this.titleLabel = this.translate.instant('documents.solve-dossier.title');
    this.descriptionLabel = this.translate.instant('documents.solve-dossier.description');
    this.documentDetailsLabel = this.translate.instant('documents.solve-dossier.document-details');
    this.documentFilenameLabel = this.translate.instant('documents.solve-dossier.document-filename');
    this.documentFraudRiskLabel = this.translate.instant('documents.solve-dossier.document-fraud-risk');
    this.documentPageCountLabel = this.translate.instant('documents.solve-dossier.document-page-count');
    this.documentExtractedTextLabel = this.translate.instant('documents.solve-dossier.document-extracted-text');
    this.documentMetadataLabel = this.translate.instant('documents.solve-dossier.document-metadata');
    this.discardButtonLabel = this.translate.instant('documents.solve-dossier.discard-button');
    this.submitButtonLabel = this.translate.instant('documents.solve-dossier.submit-button');
    
    // Upload Logic Labels
    this.uploadResponseLabel = this.translate.instant('documents.solve-dossier.upload-response-label');
    this.uploadButtonLabel = this.translate.instant('documents.solve-dossier.upload-button');
    this.mandatoryUploadDisclaimerLabel = this.translate.instant('documents.solve-dossier.mandatory-upload-disclaimer');
    this.uploadSuccessTitleLabel = this.translate.instant('documents.solve-dossier.upload-success-title');
    this.uploadSuccessDetailsLabel = this.translate.instant('documents.solve-dossier.upload-success-details');

    // Error Labels
    this.faultyGetDocumentUrlsTitleLabel = this.translate.instant('documents.solve-dossier.faulty-get-document-urls-title');
    this.faultyGetDocumentUrlsDetailsLabel = this.translate.instant('documents.solve-dossier.faulty-get-document-urls-details');
    this.documentTypeLabel = this.translate.instant('documents.solve-dossier.document-type-label');
    this.documentTypePlaceholderLabel = this.translate.instant('documents.solve-dossier.document-type-placeholder');
    this.selectTypeFirstErrorLabel = this.translate.instant('documents.solve-dossier.select-type-first-error');
    this.faultyUploadDocumentResponseTitleLabel = this.translate.instant('documents.solve-dossier.faulty-upload-document-response-title');
    this.faultyUploadDocumentResponseDetailsLabel = this.translate.instant('documents.solve-dossier.faulty-upload-document-response-details');
    this.faultySolveDossierTitleLabel = this.translate.instant('documents.solve-dossier.faulty-solve-dossier-title');
    this.faultySolveDossierDetailsLabel = this.translate.instant('documents.solve-dossier.faulty-solve-dossier-details');
  }
}
