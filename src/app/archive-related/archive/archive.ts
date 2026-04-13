import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { DossierService } from '../../service/dossier/dossier-service';
import { PageEnum } from '../../enums/page-enum';
import { SpinnerService } from '../../service/spinner/spinner-service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { MessageService, TreeNode } from 'primeng/api';
import { DocumentTypeService } from '../../service/document-type/document-type-service';
import { UserRole } from '../../model/user/user-role';
import { DocumentType } from '../../model/document/document-type.model';
import { forkJoin } from 'rxjs';
import { Mapper } from '../../model/mapper/mapper';
import { AuthService } from '../../service/auth/auth-service';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TabsModule } from 'primeng/tabs';
import { ButtonModule } from 'primeng/button';
import { TreeModule } from 'primeng/tree';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DossierStatus } from '../../model/dossier/dossier-status';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SaveArchiveLabelsDialog } from '../save-archive-labels-dialog/save-archive-labels-dialog';

@Component({
  selector: 'app-archive',
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    SelectModule,
    DatePickerModule,
    TabsModule,
    ButtonModule,
    TreeModule,
    InputTextModule,
    SaveArchiveLabelsDialog
  ],
  templateUrl: './archive.html',
  styleUrl: './archive.css',
})
export class Archive implements OnInit{
  private cookieService = inject(CookieService);
  private dossierService = inject(DossierService);
  private spinnerService = inject(SpinnerService);
  private translate = inject(TranslateService);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);
  private documentTypeService = inject(DocumentTypeService);
  private cd = inject(ChangeDetectorRef);
  private sanitizer = inject(DomSanitizer);

  protected readonly UserRoleEnum = UserRole;
  protected userRoles: UserRole[] = [];

  protected documentTypes: DocumentType[] = [];
  protected filteredDossiers: TreeNode[] = [];
  protected solvedDossiers: TreeNode[] = [];
  protected archivedDossiers: TreeNode[] = [];
  protected selectedDossiers: TreeNode[] = [];

  protected filterId: string = '';
  protected filterDocType?: DocumentType;
  protected filterDateRange: Date[] = [];
  protected pdfUrl?: SafeResourceUrl;
  protected openSaveArchiveLabelDialog: boolean = false;

  protected titleLabel: string = '';
  protected subtitleLabel: string = '';
  protected solvedTabLabel: string = '';
  protected archivedTabLabel: string = '';
  protected archiveSelectedLabel: string = '';
  protected archiveAllLabel: string = '';
  protected filterPlaceholderId: string = '';
  protected filterPlaceholderType: string = '';
  protected dossierFilterLabel: string = '';
  protected documentTypeFilterLabel: string = '';
  protected dateFilterLabel: string = '';
  private faultyGetDossiersTitleLabel: string = '';
  private faultyGetDossiersDetailsLabel: string = '';
  private faultyPatchDossiersTitleLabel: string = '';
  private faultyPatchDossiersDetailsLabel: string = '';

  ngOnInit(): void {
    this.spinnerService.show();
    this.cookieService.set('ISDox_lastVisitedPage', PageEnum.ARCHIVE, 
      { path: '/', sameSite: 'Strict' });

    this.updateLabels();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateLabels();
    });

    this.authService.rolesBehaviorSubject.subscribe((userRoles) => {
      this.userRoles = [...userRoles];
    });

    this.authService.currentUserRoles();

    this.documentTypeService.getAllDocumentTypes().subscribe({
      next: (res) => {
        this.documentTypes = [...res];
        this.spinnerService.hide()
      },
      error: () => {
        this.spinnerService.hide()
      }
    });

    const solvedDossiersParams : Record<string, any> = {
      'status': DossierStatus[DossierStatus.SOLVED],
      'sort': 'createdAt,desc'
    };

    const archivedDossiersParams : Record<string, any> = {
      'status': DossierStatus[DossierStatus.ARCHIVED],
      'sort': 'createdAt,desc'
    };

    forkJoin({
      solved: this.dossierService.getAllDossiers(solvedDossiersParams),
      archived: this.dossierService.getAllDossiers(archivedDossiersParams)
    }).subscribe({
      next: (result) => {
        if (result.solved?.content) {
          this.solvedDossiers = result.solved.content.map(dossierMapping => 
            Mapper.map("DossierMappingToTreeNode", dossierMapping) as TreeNode
          );
        }
        if (result.archived?.content) {
          this.archivedDossiers = result.archived.content.map(dossierMapping => 
            Mapper.map("DossierMappingToTreeNode", dossierMapping) as TreeNode
          );
        }

        this.cd.detectChanges();
        this.spinnerService.hide();
      },
      error: (err) => {
        console.error('Failed to retrieve dossiers:', err);
        this.spinnerService.hide();
        
        this.messageService.add({ 
          severity: 'error', 
          summary: this.faultyGetDossiersTitleLabel,
          detail: this.faultyGetDossiersDetailsLabel
        });
      }
    });
  }

  protected applyFilters() {
    this.spinnerService.show();
    
    // const baseParams: any = {
    //   sort: 'createdAt,desc',
    //   dossierId: this.filterId || undefined,
    //   documentTypeId: this.filterDocType?.id || undefined,
    //   startDate: this.filterDateRange?.[0]?.toISOString(),
    //   endDate: this.filterDateRange?.[1]?.toISOString()
    // };
  }

  protected archiveSelected() {
    const ids = this.selectedDossiers
      .filter(node => !!node.data?.documents)
      .map(node => node.data.id);
    this.dossierService.patchDossiers(ids, DossierStatus[DossierStatus.ARCHIVED]).subscribe({
      next: (blob) => {
        if (blob) {
          const localUrl = URL.createObjectURL(blob);
            
            // 2. Sanitize the URL for the iframe
            this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(localUrl);
            
            // 3. Show the display component (e.g., a Dialog)
            this.openSaveArchiveLabelDialog = true;
        }
        this.spinnerService.hide();
      },
      error: (err) => {
        console.error('Failed to retrieve label pdf:', err);
        this.messageService.add({ 
          severity: 'error', 
          summary: this.faultyPatchDossiersTitleLabel, 
          detail: this.faultyPatchDossiersDetailsLabel
        });
        this.spinnerService.hide();
      }
    });
  }

  protected archiveAll() {
    const ids = this.solvedDossiers.map(node => node.data.id);
    //this.executeArchive(ids);
  }

  private updateLabels() {
    this.titleLabel = this.translate.instant('archive.title');
    this.subtitleLabel = this.translate.instant('archive.subtitle');
    this.solvedTabLabel = this.translate.instant('archive.solved-tab');
    this.archivedTabLabel = this.translate.instant('archive.archived-tab');
    this.archiveSelectedLabel = this.translate.instant('archive.archive-selected');
    this.archiveAllLabel = this.translate.instant('archive.archive-all');
    this.filterPlaceholderId = this.translate.instant('archive.title');
    this.filterPlaceholderType = this.translate.instant('archive.title');
    this.dossierFilterLabel = this.translate.instant('archive.dossier-filter');
    this.documentTypeFilterLabel = this.translate.instant('archive.document-type-filter');
    this.dateFilterLabel = this.translate.instant('archive.date-filter');
    this.faultyGetDossiersTitleLabel = this.translate.instant('archive.faulty-get-dossiers-title');
    this.faultyGetDossiersDetailsLabel = this.translate.instant('archive.faulty-get-dossiers-details');
    this.faultyPatchDossiersTitleLabel = this.translate.instant('archive.faulty-get-dossiers-details');
    this.faultyPatchDossiersDetailsLabel = this.translate.instant('archive.faulty-get-dossiers-details');
  }
}
