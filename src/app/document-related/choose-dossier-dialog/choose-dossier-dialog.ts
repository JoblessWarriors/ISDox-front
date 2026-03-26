import { ChangeDetectorRef, Component, EventEmitter, inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DataViewModule } from 'primeng/dataview';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule } from '@angular/forms';
import { Dossier } from '../../model/dossier/dossier.model';
import { DossierService } from '../../service/dossier/dossier-service';
import { Mapper } from '../../model/mapper/mapper';
import { MessageService } from 'primeng/api';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';

@Component({
  selector: 'app-choose-dossier-dialog',
  imports: [
    FormsModule,
    CommonModule,
    DialogModule,
    DatePickerModule,
    ButtonModule,
    DataViewModule,
    PaginatorModule,
    FloatLabelModule,
    InputTextModule,
    InputGroupModule,
    InputIconModule,
    IconFieldModule
  ],
  templateUrl: './choose-dossier-dialog.html',
  styleUrl: './choose-dossier-dialog.css',
})
export class ChooseDossierDialog implements OnInit{
  @Input() isVisible: boolean = false;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() selectedDossierEmitter: EventEmitter<Dossier> = new EventEmitter<Dossier>();


  private dossierService = inject(DossierService);
  private messageService = inject(MessageService);
  private translate = inject(TranslateService);
  private cd = inject(ChangeDetectorRef);

  protected searchInput: string = '';
  protected dateStart: Date | undefined;
  protected dateEnd: Date | undefined;
  protected dossiers: Dossier[] = [];

  protected titleLabel: string = '';
  protected descriptionLabel: string = '';
  protected searchInputPlaceholderLabel: string = '';
  protected filterButtonLabel: string = '';
  protected noDossiersResultLabel: string = '';
  private faultyGetDossiersTitleLabel: string = '';
  private faultyGetDossiersDetailsLabel: string = '';

  ngOnInit(): void {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateLabels();
    });
    this.dossierService.getAllDossiers().subscribe({
      next: (response) => {
        if (response.content) {
          let newDossiers = response.content.map(dossierMapping => Mapper.map("MappingToDossier", dossierMapping) as Dossier);
          this.dossiers = newDossiers;
          this.cd.detectChanges();
        }
      },
      error: (err) => {
        console.error('Failed to retrieve dossiers:', err);
        this.messageService.add({ severity: 'error', summary: this.faultyGetDossiersTitleLabel , detail: this.faultyGetDossiersDetailsLabel });
      }
    });
    this.updateLabels();
  }

  public selectDossier(dossier: Dossier) {
    this.selectedDossierEmitter.emit(dossier);
    this.closeModal.emit(false);
  }

  private updateLabels() {
    this.titleLabel = this.translate.instant('documents.choose-dossier-dialog.title');
    this.descriptionLabel = this.translate.instant('documents.choose-dossier-dialog.description');
    this.searchInputPlaceholderLabel = this.translate.instant('documents.choose-dossier-dialog.search-input-placeholder');
    this.filterButtonLabel = this.translate.instant('documents.choose-dossier-dialog.filter-button');
    this.noDossiersResultLabel = this.translate.instant('documents.choose-dossier-dialog.no-dossiers-result');
    this.faultyGetDossiersTitleLabel = this.translate.instant('documents.choose-dossier-dialog.faulty-get-dossier-title');
    this.faultyGetDossiersDetailsLabel = this.translate.instant('documents.choose-dossier-dialog.faulty-get-dossier-details');
  }
}
