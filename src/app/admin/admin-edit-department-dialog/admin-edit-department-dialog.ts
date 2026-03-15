import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { Department } from '../../model/department/department.model';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { SpinnerService } from '../../service/spinner/spinner-service';
import { DepartmentService } from '../../service/department/department-service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-admin-edit-department-dialog',
  imports: [
    CommonModule,
    DialogModule,
    FormsModule,
    ButtonModule,
    TagModule,
    AvatarModule,
    InputTextModule,
    FloatLabelModule,
    InputGroupModule,
    InputGroupAddonModule,
    TextareaModule
  ],
  templateUrl: './admin-edit-department-dialog.html',
  styleUrl: './admin-edit-department-dialog.css',
})
export class AdminEditDepartmentDialog implements OnChanges {
  @Input() isVisible: boolean = false;
  @Input() department?: Department;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() editedDepartmentEmitter: EventEmitter<Department> = new EventEmitter<Department>();

  private translate = inject(TranslateService);
  private spinnerService = inject(SpinnerService);
  private departmentService = inject(DepartmentService);
  private messageService = inject(MessageService);

  protected nameLabel: string = '';
  protected subtitleLabel: string = '';
  protected codeLabel: string = '';
  protected descriptionLabel: string = '';
  protected discardButtonLabel: string = '';
  protected updateButtonLabel: string = '';

  private faultyEditDepartmentTitleLabel: string = '';
  private faultyEditDepartmentDetailsLabel: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.spinnerService.show();
      this.updateLabels();
    });

    this.spinnerService.show();
    this.updateLabels();
  }

  public updateDepartment() {
    this.departmentService.updateDepartment(this.department!.id!, this.department!).subscribe({
      next: (response) => {
        if (response) {
          this.editedDepartmentEmitter.emit(response);
        }
      },
      error: (err) => {
        console.error('Failed to edit department:', err);
        this.messageService.add({ severity: 'error', summary: this.faultyEditDepartmentTitleLabel , detail: this.faultyEditDepartmentDetailsLabel });
      },
      complete: () => {
        this.closeModal.emit(false);
      } 
    });
  } 

  private updateLabels() {
    this.subtitleLabel = this.translate.instant('admin.edit-department-popup.subtitle');
    this.nameLabel = this.translate.instant('admin.edit-department-popup.name');
    this.codeLabel = this.translate.instant('admin.edit-department-popup.code');
    this.descriptionLabel = this.translate.instant('admin.edit-department-popup.description');
    this.discardButtonLabel = this.translate.instant('admin.edit-department-popup.discard-button');
    this.updateButtonLabel = this.translate.instant('admin.edit-department-popup.update-button');
    this.faultyEditDepartmentTitleLabel = this.translate.instant('admin.edit-department-popup.faulty-edit-title');
    this.faultyEditDepartmentDetailsLabel = this.translate.instant('admin.edit-department-popup.faulty-edit-details');
    this.spinnerService.hide();
  }
}
