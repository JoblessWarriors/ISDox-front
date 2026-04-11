import { ChangeDetectorRef, Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { GalleriaModule } from 'primeng/galleria';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Dossier } from '../../model/dossier/dossier.model';
import { Document } from '../../model/document/document.model';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { DossierService } from '../../service/dossier/dossier-service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { FraudRiskLevel } from '../../model/document/fraud-risk-level';
import { Department } from '../../model/department/department.model';
import { DepartmentService } from '../../service/department/department-service';
import { RegistryEntryService } from '../../service/registry-entry/registry-entry-service';
import { SpinnerService } from '../../service/spinner/spinner-service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-choose-dossier-department',
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
  templateUrl: './choose-dossier-department.html',
  styleUrl: './choose-dossier-department.css',
})
export class ChooseDossierDepartment implements OnInit, OnChanges{
  @Input() dossier?: Dossier;
  @Input() isVisible = false;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() createdRegistryEntryEvent: EventEmitter<string> = new EventEmitter<string>();

  private departmentService = inject(DepartmentService);
  private registryEntryService = inject(RegistryEntryService);
  private dossierService = inject(DossierService);
  private cd = inject(ChangeDetectorRef);
  private spinnerService = inject(SpinnerService);
  private messageService = inject(MessageService);
  protected translate = inject(TranslateService);

  protected departments: Department[] = []; 
  protected selectedDepartment?: Department;
  protected FraudRiskLevel = FraudRiskLevel;
  protected activeIndex: number = 0;
  protected activeDocument?: Document;

  protected titleLabel: string = '';
  protected descriptionLabel: string = '';
  protected suggestedDepartmentLabel: string = '';
  protected suggestedDepartmentPlaceholderLabel: string = '';
  protected documentDetailsLabel: string = '';
  protected documentFilenameLabel: string = '';
  protected documentFraudRiskLabel: string = '';
  protected documentPageCountLabel: string = '';
  protected documentExtractedTextLabel: string = '';
  protected documentMetadataLabel: string = '';
  protected discardButtonLabel: string = '';
  protected submitButtonLabel: string = '';
  protected mandatoryDepartmentDisclaimerLabel: string = '';
  private faultyGetDepartmentsTitleLabel: string = '';
  private faultyGetDepartmentsDetailsLabel: string = '';
  private faultyGetDocumentPreviewsTitleLabel: string = '';
  private faultyGetDocumentPreviewsDetailsLabel: string = '';
  private faultyCreateRegistryEntryTitleLabel: string = '';
  private faultyCreateRegistryEntryDetailsLabel: string = '';


  responsiveOptions: any[] = [
    { breakpoint: '1024px', numVisible: 5 },
    { breakpoint: '768px', numVisible: 3 }
  ];

  ngOnInit() {
    this.updateLabels();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateLabels();
    });
    
    this.departmentService.getAllDepartments().subscribe({
      next: (result) => {
        if (result) {
          this.departments = result;
        }
      },
      error: (err) => {
        console.error('Get departments failed:', err);
        
        this.messageService.add({ 
          severity: 'error', 
          summary: this.faultyGetDepartmentsTitleLabel, 
          detail: this.faultyGetDepartmentsDetailsLabel 
        });
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.dossier !== undefined) {
      this.spinnerService.show();
      this.selectedDepartment = undefined;
      this.dossierService.getAllDocumentPreviews(this.dossier.id).subscribe({
        next: (result) => {
          if (result) {
            this.dossier!.documents.forEach((doc) => {
              doc.firstPageUrl = result[doc.id];
            })
          };
          this.cd.detectChanges();
          this.spinnerService.hide();
        },
        error: (err) => {
          console.error('Get document previews failed:', err);
          this.spinnerService.hide();
          this.messageService.add({ 
            severity: 'error', 
            summary: this.faultyGetDocumentPreviewsTitleLabel, 
            detail: this.faultyGetDocumentPreviewsDetailsLabel
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
    if (this.dossier && this.selectedDepartment) {
        const body = {
        dossierId: this.dossier.id,
        departmentId: this.selectedDepartment.id
      }
      this.registryEntryService.createRegistryEntry(body).subscribe({
        next: (result) => {
          if (result) {
            this.dossier!.documents.forEach((doc) => {
              doc.firstPageUrl = result[doc.id];
            });
            this.createdRegistryEntryEvent.emit(this.dossier!.id);
            this.onCloseModal();
          }
        },
        error: (err) => {
          console.error('Creating registry entry failed:', err);
          
          this.messageService.add({ 
            severity: 'error', 
            summary: this.faultyCreateRegistryEntryTitleLabel, 
            detail: this.faultyCreateRegistryEntryDetailsLabel
          });
        }
      });
    }
    else if(!this.selectedDepartment) {
      this.messageService.add({ 
        severity: 'error', 
        summary: this.mandatoryDepartmentDisclaimerLabel
      });
    }
  }

  protected onCloseModal() {
    this.closeModal.emit(false);
    this.dossier = undefined;
  }

  protected updateLabels(): void {
    this.titleLabel = this.translate.instant('documents.choose-dossier-department.title');
    this.descriptionLabel = this.translate.instant('documents.choose-dossier-department.description');
    this.suggestedDepartmentLabel = this.translate.instant('documents.choose-dossier-department.suggested-department');
    this.suggestedDepartmentPlaceholderLabel = this.translate.instant('documents.choose-dossier-department.suggested-department-placeholder');
    this.documentDetailsLabel = this.translate.instant('documents.choose-dossier-department.document-details');
    this.documentFilenameLabel = this.translate.instant('documents.choose-dossier-department.document-filename');
    this.documentFraudRiskLabel = this.translate.instant('documents.choose-dossier-department.document-fraud-risk');
    this.documentPageCountLabel = this.translate.instant('documents.choose-dossier-department.document-page-count');
    this.documentExtractedTextLabel = this.translate.instant('documents.choose-dossier-department.document-extracted-text');
    this.documentMetadataLabel = this.translate.instant('documents.choose-dossier-department.document-metadata');
    this.discardButtonLabel = this.translate.instant('documents.choose-dossier-department.discard-button');
    this.submitButtonLabel = this.translate.instant('documents.choose-dossier-department.submit-button');
    this.faultyGetDepartmentsTitleLabel = this.translate.instant('documents.choose-dossier-department.faulty-get-departments-title');
    this.faultyGetDepartmentsDetailsLabel = this.translate.instant('documents.choose-dossier-department.faulty-get-departments-details');
    this.faultyGetDocumentPreviewsTitleLabel = this.translate.instant('documents.choose-dossier-department.faulty-get-document-previews-title');
    this.faultyGetDocumentPreviewsDetailsLabel = this.translate.instant('documents.choose-dossier-department.faulty-get-document-previews-details');
    this.faultyCreateRegistryEntryTitleLabel = this.translate.instant('documents.choose-dossier-department.faulty-create-registry-entry-title');
    this.faultyCreateRegistryEntryDetailsLabel = this.translate.instant('documents.choose-dossier-department.faulty-create-registry-entry-details');
    this.mandatoryDepartmentDisclaimerLabel = this.translate.instant('documents.choose-dossier-department.mandatory-department-disclaimer');
  }
}
