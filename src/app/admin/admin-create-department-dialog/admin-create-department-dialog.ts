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
import { Department } from '../../model/department/department.model';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { SpinnerService } from '../../service/spinner/spinner-service';
import { DepartmentService } from '../../service/department/department-service';
import { UserService } from '../../service/user/user-service';
import { MessageService } from 'primeng/api';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-admin-create-department-dialog',
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
  templateUrl: './admin-create-department-dialog.html',
  styleUrl: './admin-create-department-dialog.css',
})
export class AdminCreateDepartmentDialog implements OnChanges{
  @Input() isVisible: boolean = false;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() createdDepartmentEmitter: EventEmitter<Department> = new EventEmitter<Department>();

  private translate = inject(TranslateService);
  private spinnerService = inject(SpinnerService);
  private departmentService = inject(DepartmentService);
  private messageService = inject(MessageService);

  protected nameLabel: string = '';
  protected subtitleLabel: string = '';
  protected titleLabel: string = '';
  protected codeLabel: string = '';
  protected descriptionLabel: string = '';
  protected discardButtonLabel: string = '';
  protected createButtonLabel: string = '';

  private faultyCreateDepartmentTitleLabel: string = '';
  private faultyCreateDepartmentDetailsLabel: string = '';

  protected department = {
    name: '',
    code: '',
    description: ''
  } as Department;

  ngOnChanges(changes: SimpleChanges): void {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.spinnerService.show();
      this.updateLabels();
    });

    this.spinnerService.show();
    this.updateLabels();
  }

  public createDepartment() {
    this.departmentService.createDepartment(this.department).subscribe({
      next: (response) => {
        if (response) {
          this.createdDepartmentEmitter.emit(response);
        }
      },
      error: (err) => {
        console.error('Failed to create department:', err);
        this.messageService.add({ severity: 'error', summary: this.faultyCreateDepartmentTitleLabel , detail: this.faultyCreateDepartmentDetailsLabel });
      },
      complete: () => {
        this.closeModal.emit(false);
      }
    });
  }

  private updateLabels() {
    this.titleLabel = this.translate.instant('admin.create-department-popup.title');
    this.subtitleLabel = this.translate.instant('admin.create-department-popup.subtitle');
    this.nameLabel = this.translate.instant('admin.create-department-popup.name');
    this.codeLabel = this.translate.instant('admin.create-department-popup.code');
    this.descriptionLabel = this.translate.instant('admin.create-department-popup.description');
    this.discardButtonLabel = this.translate.instant('admin.create-department-popup.discard-button');
    this.createButtonLabel = this.translate.instant('admin.create-department-popup.create-button');
    this.faultyCreateDepartmentTitleLabel = this.translate.instant('admin.create-department-popup.faulty-create-title');
    this.faultyCreateDepartmentDetailsLabel = this.translate.instant('admin.create-department-popup.faulty-create-details');
    this.spinnerService.hide();
  }
}
