import { Component, inject, OnInit } from '@angular/core';
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
import { TreeNode } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';

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
  private translate = inject(TranslateService);

  ngOnInit(): void {
    this.cookieService.set('ISDox_lastVisitedPage', PageEnum.DOXI, 
      { path: '/', sameSite: 'Strict' });
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      //this.spinnerService.show();
      this.updateLabels();
    });

    //this.spinnerService.show();
    this.updateLabels();
  }

  
  protected departments: any[] = [];
  // Results
  protected foundDossiers: TreeNode[] = [];
  
  // Standard Filters
  protected filters = {
    dossierId: '',
    department: null,
    dateRange: [],
    docType: null
  };

  // Metadata Filters (Specific fields mentioned)
  protected metadataFilters = {
    cnp: '',
    fullName: '',
    registrationNumber: ''
  };

  // UI State
  protected isDoxiVisible: boolean = false;
  protected searchPerformed: boolean = false;

  // Labels
  protected searchTitleLabel = '';
  protected metadataSectionLabel = '';
  protected doxiButtonLabel = '';

  protected onSearch() {
    this.searchPerformed = true;
    const params = {
      ...this.filters,
      ...this.metadataFilters,
      startDate: this.filters.dateRange?.[0],
      endDate: this.filters.dateRange?.[1]
    };

    this.dossierService.getAllDossiers(params).subscribe(res => {
      this.foundDossiers = res.content?.map(d => Mapper.map("DossierMappingToTreeNode", d)) || [];
    });
  }

  protected openDoxi() {
    this.isDoxiVisible = true;
  }

  private updateLabels() {
    this.searchTitleLabel = this.translate.instant('doxi.search-title');
    this.metadataSectionLabel = this.translate.instant('doxi.mmetadata-section');
    this.doxiButtonLabel = this.translate.instant('doxi.doxi-button');
  }

}
