import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SecurityContext, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-save-archive-labels-dialog',
  imports: [
    DialogModule,
    ButtonModule,
    ProgressSpinnerModule
  ],
  templateUrl: './save-archive-labels-dialog.html',
  styleUrl: './save-archive-labels-dialog.css',
})
export class SaveArchiveLabelsDialog implements OnInit {
  @Input() isVisible: boolean = false;
  @Input() pdfUrl?: SafeResourceUrl;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  private sanitizer = inject(DomSanitizer);
  private translate = inject(TranslateService);

  protected titleLabel: string = '';
  protected subtitleLabel: string = '';
  protected loadingLabel: string = '';
  protected printButtonLabel: string = '';
  protected saveButtonLabel: string = '';

  ngOnInit(): void {
    this.updateLabels();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateLabels();
    });
  }

  protected onClose() {
    this.closeModal.emit(false);
  }

  protected printPdf() {
    if (!this.pdfUrl) return;
    
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = this.pdfUrl as string;
    document.body.appendChild(iframe);
    
    iframe.onload = () => {
      iframe.contentWindow?.print();
      setTimeout(() => document.body.removeChild(iframe), 1000);
    };
  }

  protected downloadPdf() {
    if (!this.pdfUrl) return;

    const rawUrl = this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, this.pdfUrl);
    if (!rawUrl) return;

    const link = document.createElement('a');
    link.href = rawUrl;
    link.download = 'labels.pdf';
    link.type = 'application/pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private updateLabels(): void {
    this.titleLabel = this.translate.instant('archive.save-archive-labels-dialog.title');
    this.subtitleLabel = this.translate.instant('archive.save-archive-labels-dialog.subtitle');
    this.loadingLabel = this.translate.instant('archive.save-archive-labels-dialog.loading');
    this.printButtonLabel = this.translate.instant('archive.save-archive-labels-dialog.print-button');
    this.saveButtonLabel = this.translate.instant('archive.save-archive-labels-dialog.save-button');
  }
}
