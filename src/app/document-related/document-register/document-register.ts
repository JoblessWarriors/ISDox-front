import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TreeModule } from 'primeng/tree';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { MessageService, TreeNode } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { DossierService } from '../../service/dossier/dossier-service';
import { DossierStatus } from '../../model/dossier/dossier-status';
import { Mapper } from '../../model/mapper/mapper';
import { ChooseDossierDepartment } from '../choose-dossier-department/choose-dossier-department';
import { SpinnerService } from '../../service/spinner/spinner-service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-document-register',
  imports: [
    CommonModule, 
    FormsModule, 
    TreeModule, 
    DialogModule, 
    ButtonModule, 
    InputTextModule,
    SelectModule,
    CheckboxModule,
    CardModule,
    ChooseDossierDepartment
  ],
  templateUrl: './document-register.html',
  styleUrl: './document-register.css',
})
export class DocumentRegister {
  private dossierService = inject(DossierService);
  private spinnerService = inject(SpinnerService);
  private translate = inject(TranslateService);
  private messageService = inject(MessageService);
  private cd = inject(ChangeDetectorRef);
  
  protected openChooseDossierDepartment: boolean = false;
  protected dossiers: TreeNode[] = [];
  protected selectedNode!: TreeNode;

  protected titleLabel: string = '';
  protected subtitleLabel: string = '';
  private truthyCreateRegistryEntryTitleLabel: string = '';
  private truthyCreateRegistryEntryDetailsLabel: string = '';
  private faultyGetDossiersTitleLabel: string = '';
  private faultyGetDossiersDetailsLabel: string = '';
  
  displayRegistration: boolean = false;
  currentDraft: any = null;

  ngOnInit() {
    const params : Record<string, any> = {
      'status': DossierStatus[1],
      'sort': 'createdAt,desc'
    }

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateLabels();
    });
    this.spinnerService.show();
    this.dossierService.getAllDossiers(params).subscribe({
      next: (response) => {
        if (response.content) {
          let newDossiers = response.content.map(dossierMapping => Mapper.map("DossierMappingToTreeNode", dossierMapping) as TreeNode);
          this.dossiers = newDossiers;
          this.cd.detectChanges();
          this.spinnerService.hide();
        }
      },
      error: (err) => {
        console.error('Failed to retrieve dossiers:', err);
        this.messageService.add({ 
          severity: 'error', 
          summary: this.faultyGetDossiersTitleLabel, 
          detail: this.faultyGetDossiersDetailsLabel
        });
        this.spinnerService.hide();
      }
    });
  }

  protected onNodeSelect(event: any) {
    const data = event.node.data;
    if (data && 'documents' in data) {
      this.currentDraft = event.node;
      this.openChooseDossierDepartment = true;
    }
  }

  protected createdRegistryEntry(dossierId: string) {
    this.dossiers = this.dossiers.filter(x => x.key != dossierId);

    this.messageService.add({ 
      severity: 'success', 
      summary: this.truthyCreateRegistryEntryTitleLabel, 
      detail: this.truthyCreateRegistryEntryDetailsLabel
    });
  } 

  private updateLabels() {
    this.titleLabel = this.translate.instant('documents.document-register.title');
    this.subtitleLabel = this.translate.instant('documents.document-register.subtitle');
    this.truthyCreateRegistryEntryTitleLabel = this.translate.instant('documents.document-register.truthy-create-registry-entry-title');
    this.truthyCreateRegistryEntryDetailsLabel = this.translate.instant('documents.document-register.truthy-create-registry-entry-details');
    this.faultyGetDossiersTitleLabel = this.translate.instant('documents.document-register.faulty-get-dossier-title');
    this.faultyGetDossiersDetailsLabel = this.translate.instant('documents.document-register.faulty-get-dossier-details');
  }
}
