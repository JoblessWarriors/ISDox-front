import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { DossierService } from '../../service/dossier/dossier-service';
import { SpinnerService } from '../../service/spinner/spinner-service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { MessageService, TreeNode } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TreeModule } from 'primeng/tree';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { ChooseDossierDepartment } from '../choose-dossier-department/choose-dossier-department';
import { TabsModule } from 'primeng/tabs';
import { DossierStatus } from '../../model/dossier/dossier-status';
import { Mapper } from '../../model/mapper/mapper';
import { AuthService } from '../../service/auth/auth-service';
import { UserService } from '../../service/user/user-service';
import { User } from '../../model/user/user.model';
import { Department } from '../../model/department/department.model';
import { Dossier } from '../../model/dossier/dossier.model';
import { SolveDossierDialog } from '../solve-dossier-dialog/solve-dossier-dialog';

@Component({
  selector: 'app-document-solve',
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
    TabsModule,
    SolveDossierDialog
  ],
  templateUrl: './document-solve.html',
  styleUrl: './document-solve.css',
})
export class DocumentSolve implements OnInit {
  private dossierService = inject(DossierService);
  private spinnerService = inject(SpinnerService);
  private translate = inject(TranslateService);
  private messageService = inject(MessageService);
  private userService = inject(UserService);
  private cd = inject(ChangeDetectorRef);
  
  protected openSolveDossier: boolean = false;
  protected registeredDossiers: TreeNode[] = [];
  protected inWorkDossiers: TreeNode[] = [];
  protected selectedNode!: TreeNode;
  protected departments: Department[] = [];
  protected selectedDepartment?: Department;
  protected currentDraft?: any;

  private user?: User;

  protected titleLabel: string = '';
  protected subtitleLabel: string = '';
  protected registeredTabLabel: string = '';
  protected inWorkTabLabel: string = '';
  protected workingForDepartmentLabel: string = '';
  protected selectDepartmentPlaceholderLabel: string = '';
  protected selectDepartmentToViewDossiersLabel: string = '';
  private faultyGetRegisteredDossiersTitleLabel: string = '';
  private faultyGetRegisteredDossiersDetailsLabel: string = '';
  private faultyGetInWorkDossiersTitleLabel: string = '';
  private faultyGetInWorkDossiersDetailsLabel: string = '';
  private truthySolveDossierTitleLabel: string = '';
  private truthySolveDossierDetailsLabel: string = '';

  ngOnInit() {
    this.spinnerService.show();
    this.userService.getCurrentUser().subscribe({
      next: (response) => {
        this.user = Mapper.map('MappingToUser', response);
        this.departments = this.user.departments;
        this.spinnerService.hide();
      },
      error: (err) => {
        console.error('Failed to retrieve current user:', err);
        this.spinnerService.hide();
      }
    })
    

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateLabels();
    });
    this.updateLabels();
    
  }

  protected onDepartmentChange(event: any) {
    console.log(event)
    const registeredDossiersParams : Record<string, any> = {
      'status': DossierStatus[DossierStatus.REGISTERED],
      'departmentId': this.selectedDepartment!.id,
      'sort': 'createdAt,desc'
    };

    const inWorkDossiersParams : Record<string, any> = {
      'status': DossierStatus[DossierStatus.IN_WORK],
      'departmentId': this.selectedDepartment!.id,
      'assignedSpecialistId': this.user!.id,
      'sort': 'createdAt,desc'
    };

    this.dossierService.getAllDossiers(registeredDossiersParams).subscribe({
      next: (response) => {
        if (response.content) {
          let newDossiers = response.content.map(dossierMapping => Mapper.map("DossierMappingToTreeNode", dossierMapping) as TreeNode);
          this.registeredDossiers = newDossiers;
          this.cd.detectChanges();
        }
        this.spinnerService.hide();
      },
      error: (err) => {
        console.error('Failed to retrieve dossiers:', err);
        this.messageService.add({ 
          severity: 'error', 
          summary: this.faultyGetRegisteredDossiersTitleLabel, 
          detail: this.faultyGetRegisteredDossiersDetailsLabel
        });
        this.spinnerService.hide();
      }
    });

    this.dossierService.getAllDossiers(inWorkDossiersParams).subscribe({
      next: (response) => {
        if (response.content) {
          let newDossiers = response.content.map(dossierMapping => Mapper.map("DossierMappingToTreeNode", dossierMapping) as TreeNode);
          this.inWorkDossiers = newDossiers;
          this.cd.detectChanges();
        }
        this.spinnerService.hide();
      },
      error: (err) => {
        console.error('Failed to retrieve dossiers:', err);
        this.messageService.add({ 
          severity: 'error', 
          summary: this.faultyGetInWorkDossiersTitleLabel, 
          detail: this.faultyGetInWorkDossiersDetailsLabel
        });
        this.spinnerService.hide();
      }
    });
  }

  protected onNodeSelect(event: any) {
    const data = event.node.data;
    if (data && 'documents' in data) {
      this.currentDraft = event.node;
      if (this.currentDraft?.data.status == DossierStatus[DossierStatus.REGISTERED]) {
        this.dossierService.patchDossier(this.currentDraft.data.id, DossierStatus[DossierStatus.IN_WORK]).subscribe({
          next: (response) => {
            if (response) {
              this.openSolveDossier = true;
              data.status = DossierStatus[DossierStatus.IN_WORK];
              this.registeredDossiers = this.registeredDossiers.filter(x => x.key != data.id);
              this.inWorkDossiers.push(data);
            }
            this.spinnerService.hide();
          },
          error: (err) => {
            console.error('Failed to patch dossier:', err);
            this.spinnerService.hide();
          }
        });
      }
      else {
        this.openSolveDossier = true;
      }
    }
  }

  protected solvedDossierEvent(dossierId: string) {
    this.inWorkDossiers = this.inWorkDossiers.filter(x => x.key != dossierId);
    this.messageService.add({ 
      severity: 'success', 
      summary: this.truthySolveDossierTitleLabel, 
      detail: this.truthySolveDossierDetailsLabel
    });
  }

  private updateLabels(): void {
    this.titleLabel = this.translate.instant('documents.document-solve.title');
    this.subtitleLabel = this.translate.instant('documents.document-solve.subtitle');
    this.faultyGetRegisteredDossiersTitleLabel = this.translate.instant('documents.document-solve.faulty-get-registered-dossier-title');
    this.faultyGetRegisteredDossiersDetailsLabel = this.translate.instant('documents.document-solve.faulty-get-registered-dossier-details');
    this.faultyGetInWorkDossiersTitleLabel = this.translate.instant('documents.document-solve.faulty-get-in-work-dossier-title');
    this.faultyGetInWorkDossiersDetailsLabel = this.translate.instant('documents.document-solve.faulty-get-in-work-dossier-details');
    this.registeredTabLabel = this.translate.instant('documents.document-solve.registered-tab');
    this.inWorkTabLabel = this.translate.instant('documents.document-solve.in-work-tab');
    this.workingForDepartmentLabel = this.translate.instant('documents.document-solve.working-for-department');
    this.selectDepartmentPlaceholderLabel = this.translate.instant('documents.document-solve.select-department-placeholder');
    this.selectDepartmentToViewDossiersLabel = this.translate.instant('documents.document-solve.select-department-to-view-dossiers');
    this.truthySolveDossierTitleLabel = this.translate.instant('documents.document-solve.truthy-solve-dossier-title');
    this.truthySolveDossierDetailsLabel = this.translate.instant('documents.document-solve.truthy-solve-dossier-details');
  }
}
