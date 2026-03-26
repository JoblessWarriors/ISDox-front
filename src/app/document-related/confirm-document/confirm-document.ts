import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { Document } from '../../model/document/document.model';
import { FraudRiskLevel } from '../../model/document/fraud-risk-level';

@Component({
  selector: 'app-confirm-document',
  imports: [
    CommonModule,
    DialogModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
    SelectModule,
    TextareaModule
  ],
  templateUrl: './confirm-document.html',
  styleUrl: './confirm-document.css',
})
export class ConfirmDocument implements OnChanges, OnDestroy, OnInit {
  @Input() isVisible: boolean = false;
  @Input() file?: File = undefined;
  @Input() document?: Document = undefined;
  @Output() uploadedDocument: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  private sanitizer = inject(DomSanitizer);
  private translate = inject(TranslateService);

  protected documentUrl: SafeResourceUrl | string = '';

  protected selectedFraudRiskLevel: any;
  protected fraudRiskLevels: any[] = [];

  protected pdfUrl?: SafeResourceUrl;
  protected imageUrl?: string;
  private rawObjectUrl?: string;

  protected titleLabel: string = '';
  protected descriptionLabel: string = '';
  protected noDocxLabel: string = '';
  protected noPreviewLabel: string = '';
  protected mainInfoLabel: string = '';
  protected metadataLabel: string = '';
  protected nameLabel: string = '';
  protected categoryLabel: string = '';
  protected notesLabel: string = '';
  protected discardButtonLabel: string = '';
  protected confirmButtonLabel: string = '';
  protected fraudReportLabel: string = '';

  ngOnInit(): void {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateLabels();
      this.updateFraudRiskLevels();
      this.checkFraudRiskLevel();
    });

    this.updateLabels();
    this.updateFraudRiskLevels();
    this.checkFraudRiskLevel();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['file']) return;

    if (this.rawObjectUrl) {
      URL.revokeObjectURL(this.rawObjectUrl);
      this.rawObjectUrl = undefined;
    }

    this.pdfUrl = undefined;
    this.imageUrl = undefined;

    if (!this.file) return;

    this.rawObjectUrl = URL.createObjectURL(this.file);

    if (this.file.type === 'application/pdf') {
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.rawObjectUrl);
    } else if (this.file.type.startsWith('image/')) {
      this.imageUrl = this.rawObjectUrl;
    }
  }

  ngOnDestroy(): void {
    if (this.rawObjectUrl) {
      URL.revokeObjectURL(this.rawObjectUrl);
    }
  }

  protected saveDocument(): void {
    this.uploadedDocument.emit(true);
    this.closeModal.emit(false);
  }
  
  protected updateMetadata(key: string, newValue: string) {
    this.document?.metadata.set(key, newValue);
  }

  private updateLabels() {
    this.titleLabel = this.translate.instant('documents.confirm-document.title');
    this.descriptionLabel = this.translate.instant('documents.confirm-document.description');
    this.noDocxLabel = this.translate.instant('documents.confirm-document.no-docx');
    this.noPreviewLabel = this.translate.instant('documents.confirm-document.no-preview');
    this.mainInfoLabel = this.translate.instant('documents.confirm-document.main-info');
    this.metadataLabel = this.translate.instant('documents.confirm-document.metadata');
    this.nameLabel = this.translate.instant('documents.confirm-document.name');
    this.categoryLabel = this.translate.instant('documents.confirm-document.category');
    this.notesLabel = this.translate.instant('documents.confirm-document.notes');
    this.discardButtonLabel = this.translate.instant('documents.confirm-document.discard-button');
    this.confirmButtonLabel = this.translate.instant('documents.confirm-document.confirm-button');
    this.fraudReportLabel = this.translate.instant('documents.confirm-document.fraud-report');
  }

  private updateFraudRiskLevels() {
    this.fraudRiskLevels = [];
    Object.keys(FraudRiskLevel).filter(key => isNaN(Number(FraudRiskLevel[key as keyof typeof FraudRiskLevel]))).forEach(key => {
      var keyTranslation = this.translate.instant(`fraud-risk-levels.${key}`);
      this.fraudRiskLevels.push({ name: keyTranslation, code: key });
    });
  }

  private checkFraudRiskLevel() {
    this.fraudRiskLevels.forEach(level => {
      if (level.code == this.document?.fraudRiskLevel) {
        this.selectedFraudRiskLevel = level;
      }
    });
  }
}