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
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  private sanitizer = inject(DomSanitizer);
  private translate = inject(TranslateService);

  protected documentUrl: SafeResourceUrl | string = '';
  protected docType: 'pdf' | 'image' | 'docx' | 'unknown' = 'unknown';

  protected selectedDoc: { name: string; category: string | null; notes: string } = {
    name: '',
    category: null,
    notes: ''
  };

  protected categories: string[] = ['General', 'Contract', 'Invoice', 'Report'];
  protected pdfUrl?: SafeResourceUrl;
  protected imageUrl?: string;
  private rawObjectUrl?: string;

  protected titleLabel: string = '';
  protected descriptionLabel: string = '';
  protected noDocxLabel: string = '';
  protected noPreviewLabel: string = '';
  protected metadataLabel: string = '';
  protected nameLabel: string = '';
  protected categoryLabel: string = '';
  protected notesLabel: string = '';
  protected discardButtonLabel: string = '';
  protected confirmButtonLabel: string = '';

  ngOnInit(): void {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateLabels();
    });

    this.updateLabels();
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

    this.selectedDoc = {
      name: this.file?.name,
      category: this.file?.type,
      notes: ''
    }
  }

  ngOnDestroy(): void {
    if (this.rawObjectUrl) {
      URL.revokeObjectURL(this.rawObjectUrl);
    }
  }

  openDocument(doc: { url: string; name?: string; category?: string; notes?: string }) {
    this.docType = this.getFileType(doc.url);
    this.documentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(doc.url);

    this.selectedDoc = {
      name: doc.name ?? '',
      category: doc.category ?? null,
      notes: doc.notes ?? ''
    };
  }

  saveDocument(): void {
    this.closeModal.emit(false);
  }

  getFileType(url: string) {
    return this.file?.type === 'application/pdf'
    ? 'pdf'
    : this.file?.type?.startsWith('image/')
      ? 'image'
      : this.file?.name?.toLowerCase().endsWith('.docx')
        ? 'docx'
        : 'unknown';
  }

  private updateLabels() {
    this.titleLabel = this.translate.instant('documents.confirm-document.title');
    this.descriptionLabel = this.translate.instant('documents.confirm-document.description');
    this.noDocxLabel = this.translate.instant('documents.confirm-document.no-docx');
    this.noPreviewLabel = this.translate.instant('documents.confirm-document.no-preview');
    this.metadataLabel = this.translate.instant('documents.confirm-document.metadata');
    this.nameLabel = this.translate.instant('documents.confirm-document.name');
    this.categoryLabel = this.translate.instant('documents.confirm-document.category');
    this.notesLabel = this.translate.instant('documents.confirm-document.notes');
    this.discardButtonLabel = this.translate.instant('documents.confirm-document.discard-button');
    this.confirmButtonLabel = this.translate.instant('documents.confirm-document.confirm-button');
  }
}