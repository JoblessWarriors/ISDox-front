import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { PageEnum } from '../../enums/page-enum';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TreeModule } from 'primeng/tree';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { DossierService } from '../../service/dossier/dossier-service';
import { SpinnerService } from '../../service/spinner/spinner-service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Mapper } from '../../model/mapper/mapper';
import { MessageService, TreeNode } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { Department } from '../../model/department/department.model';
import { ChatSession } from '../../model/chat-session/chat-session.model';
import { ChatMessage } from '../../model/chat-message/chat-message.model';
import { ChatService } from '../../service/chat/chat-service';
import { DepartmentService } from '../../service/department/department-service';

@Component({
  selector: 'app-doxi-search',
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    FloatLabelModule,
    DatePickerModule,
    SelectModule,
    ButtonModule,
    TreeModule,
    DividerModule,
    DialogModule,
    InputTextModule

  ],
  templateUrl: './doxi-search.html',
  styleUrl: './doxi-search.css',
})
export class DoxiSearch implements OnInit {
  private cookieService = inject(CookieService);
  private dossierService = inject(DossierService);
  private spinnerService = inject(SpinnerService);
  private messageService = inject(MessageService);
  private chatService = inject(ChatService);
  private departmentService = inject(DepartmentService);
  private translate = inject(TranslateService);
  private cd = inject(ChangeDetectorRef);

  private dossiers: TreeNode[] = [];
  protected filteredDossiers: TreeNode[] = [];
  protected departments: Department[] = [];
  protected foundDossiers: TreeNode[] = [];
  
  protected chatSession?: ChatSession;
  protected chatMessages: ChatMessage[] = [];
  protected userMessage: string = '';
  protected isDoxiTyping: boolean = false;

  protected filters = {
    id: '',
    dateRange: [],
    docType: null
  };

  protected selectedDepartment?: Department;

  protected metadataFilters = {
    cnp: '',
    name: '',
    registrationNumber: ''
  };

  protected isDoxiVisible: boolean = false;
  protected searchPerformed: boolean = false;

  protected searchTitleLabel: string = '';
  protected metadataSectionLabel: string = '';
  protected doxiButtonLabel: string = '';
  protected dossierFilterPlaceholderLabel: string = '';
  protected departmentSelectPlaceholderLabel: string = '';
  protected registrationNumberFilterPlaceholderLabel: string = '';
  protected dataRangeFilterPlaceholderLabel: string = '';
  protected identityNumberFilterPlaceholderLabel: string = '';
  protected nameFilterPlaceholderLabel: string = '';
  protected searchButtonLabel: string = '';
  protected noDossiersLabel: string = '';
  protected poweredByDoxiLabel: string = '';
  protected doxiNameLabel: string = '';
  protected askInputPlaceholderLabel: string = '';

  private firstMessageLabel: string = '';

  ngOnInit(): void {
    this.cookieService.set('ISDox_lastVisitedPage', PageEnum.DOXI, 
      { path: '/', sameSite: 'Strict' });

    this.spinnerService.show();

    this.departmentService.getAllDepartments().subscribe({
      next: (response) => {
        if (response) {
          this.departments = response;
        }
      },
      error: (err) => {
        console.error('Failed to retrieve departments: ', err);
        this.messageService.add({ 
          severity: 'error', 
          //summary: this.faultyGetRegisteredDossiersTitleLabel, 
          //detail: this.faultyGetRegisteredDossiersDetailsLabel
        });
      }
    })
    
    this.dossierService.getAllDossiers().subscribe({
      next: (response) => {
        if (response.content) {
          let newDossiers = response.content?.map(dossierMapping => Mapper.map("DossierMappingToTreeNode", dossierMapping) as TreeNode) ?? [];
          this.dossiers = newDossiers;
          this.filteredDossiers = [...newDossiers]
          
        }
        this.spinnerService.hide();
      },
      error: (err) => {
        console.error('Failed to retrieve dossiers:', err);
        this.messageService.add({ 
          severity: 'error', 
          //summary: this.faultyGetRegisteredDossiersTitleLabel, 
          //detail: this.faultyGetRegisteredDossiersDetailsLabel
        });
        this.spinnerService.hide();
      }
    });
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateLabels();
    });
    this.updateLabels();
    this.cd.detectChanges();
    
  }

  protected onSearch() {
    this.spinnerService.show();
    this.searchPerformed = true;
    const rawParams = {
    ...this.filters,
    ...this.metadataFilters,
    departmentId: this.selectedDepartment?.id ?? null,
    startDate: this.filters.dateRange?.[0],
    endDate: this.filters.dateRange?.[1]
  };

  const cleanParams = Object.fromEntries(
    Object.entries(rawParams).filter(([_, value]) => 
      value !== null && value !== undefined && value !== ''
    )
  );

    this.dossierService.getAllDossiers(cleanParams).subscribe({
      next: (response) => {
        if (response.content) {
          let newDossiers = response.content.map(dossierMapping => Mapper.map("DossierMappingToTreeNode", dossierMapping) as TreeNode);
          this.filteredDossiers = [...newDossiers]
          this.cd.detectChanges();
        }
        this.spinnerService.hide();
      },
      error: (err) => {
        this.filteredDossiers = [...this.dossiers];
        console.error('Failed to filter dossiers:', err);
        this.messageService.add({ 
          severity: 'error', 
          //summary: this.faultyGetRegisteredDossiersTitleLabel, 
          //detail: this.faultyGetRegisteredDossiersDetailsLabel
        });
        this.spinnerService.hide();
      }
    });
  }

  protected openDoxi() {
    if (this.chatSession == undefined) {
      this.spinnerService.show();
      this.chatService.createChatSession().subscribe({
        next: (response) => {
          if (response) {
            this.spinnerService.hide();
            this.chatSession = response;
            this.isDoxiVisible = true;
            if (this.chatMessages.length == 0) {
              this.chatMessages.push({
                text: this.firstMessageLabel
              });
            }
          }
          
        },
        error: (err) => {
          console.error('Failed to initialize a chat session:', err);
          this.messageService.add({ 
            severity: 'error', 
            //summary: this.faultyGetRegisteredDossiersTitleLabel, 
            //detail: this.faultyGetRegisteredDossiersDetailsLabel
          });
          this.spinnerService.hide();
        }
      });
    }
    else {
      this.isDoxiVisible = true;
    }
  }

  protected sendMessage() {
    this.chatMessages.push({
      text: this.userMessage,
      sender: this.chatSession?.userId
    });
    this.isDoxiTyping = true;
    const body = {
      content: this.userMessage
    };
    this.chatService.createChatMessage(this.chatSession!.id, body).subscribe({
      next: (response) => {
        if (response) {
          const newMessage = Mapper.map('MappingToChatMessage', response) as ChatMessage;
          this.chatMessages.push(newMessage);
          this.isDoxiTyping = false;
          const newDossiers = response.referencedDossiers.map(dossierMapping => Mapper.map("DossierMappingToTreeNode", dossierMapping)) as TreeNode[];
          this.filteredDossiers = [...newDossiers];
          this.userMessage = '';
          this.cd.detectChanges();
        }
        
      },
      error: (err) => {
        console.error('Failed to retrieve response: ', err);
        this.messageService.add({ 
          severity: 'error', 
          //summary: this.faultyGetRegisteredDossiersTitleLabel, 
          //detail: this.faultyGetRegisteredDossiersDetailsLabel
        });
        this.spinnerService.hide();
      }
    });
  }

  private updateLabels() {
    this.searchTitleLabel = this.translate.instant('doxi.search-title');
    this.metadataSectionLabel = this.translate.instant('doxi.metadata-section');
    this.doxiButtonLabel = this.translate.instant('doxi.doxi-button');
    this.dossierFilterPlaceholderLabel = this.translate.instant('doxi.dossier-filter-placeholder');
    this.departmentSelectPlaceholderLabel = this.translate.instant('doxi.department-select-placeholder');
    this.registrationNumberFilterPlaceholderLabel = this.translate.instant('doxi.registration-number-filter-placeholder');
    this.identityNumberFilterPlaceholderLabel = this.translate.instant('doxi.identity-number-filter-placeholder');
    this.nameFilterPlaceholderLabel = this.translate.instant('doxi.name-filter-placeholder');
    this.searchButtonLabel = this.translate.instant('doxi.search-button');
    this.noDossiersLabel = this.translate.instant('doxi.no-dossiers');
    this.poweredByDoxiLabel = this.translate.instant('doxi.powered-by-doxi');
    this.dataRangeFilterPlaceholderLabel = this.translate.instant('doxi.data-range-filter-placeholder');
    this.doxiNameLabel = this.translate.instant('doxi.doxi-name');
    this.askInputPlaceholderLabel = this.translate.instant('doxi.ask-input-placeholder');
    this.firstMessageLabel = this.translate.instant('doxi.first-message');
  }
}
