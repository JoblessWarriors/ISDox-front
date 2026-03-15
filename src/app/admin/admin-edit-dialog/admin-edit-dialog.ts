import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { User } from '../../model/user/user.model';
import { FormsModule } from '@angular/forms';
import { ButtonModule, ButtonStyle } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { SpinnerService } from '../../service/spinner/spinner-service';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { IdentityType } from '../../model/user/identity-type';
import { UserRole } from '../../model/user/user-role';
import { Department } from '../../model/department/department.model';
import { DepartmentService } from '../../service/department/department-service';
import { UserService } from '../../service/user/user-service';
import { UserMapping } from '../../model/user/user-mapping.model';
import { Mapper } from '../../model/mapper/mapper';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-admin-edit-dialog',
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
    MultiSelectModule,
    SelectModule
  ],
  templateUrl: './admin-edit-dialog.html',
  styleUrl: './admin-edit-dialog.css',
})
export class AdminEditDialog implements OnChanges {
  @Input() user?: User;
  @Input() isVisible: boolean = false;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() editedUserEmitter: EventEmitter<User> = new EventEmitter<User>();

  private translate = inject(TranslateService);
  private spinnerService = inject(SpinnerService);
  private departmentService = inject(DepartmentService);
  private userService = inject(UserService);
  private messageService = inject(MessageService);

  protected nameLabel: string = '';
  protected surnameLabel: string = '';
  protected emailLabel: string = '';
  protected identificationTypeLabel: string = '';
  protected identificationNumberLabel: string = '';
  protected rolesLabel: string = "";
  protected departmentsLabel: string = '';
  protected updateButtonLabel: string = '';
  protected discardButtonLabel: string = '';
  protected descriptionLabel: string = '';
  protected activeUserLabel: string = '';
  protected inactiveUserLabel: string = '';

  private faultyEditUserTitleLabel: string = '';
  private faultyEditUserDetailsLabel: string = '';

  protected identityTypes: any[] = [];
  protected selectedIdentityType: any;

  protected userRoles: any[] = [];
  protected selectedUserRoles: any[] = [];

  protected departments: Department[] = [];
  protected selectedDepartments: Department[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.spinnerService.show();
      this.updateData();
      this.checkUserData();
      this.updateLabels();
    });

    this.spinnerService.show();
    this.updateData();
    this.checkUserData();
    this.updateLabels();
  }

  protected updateUser() {
    const updatedUser = {
      email: this.user?.email,
      firstName: this.user?.firstName,
      lastName: this.user?.lastName,
      identityType: IdentityType[Number(this.selectedIdentityType.code)],
      identityNumber: this.user?.identityNumber,
      roles: this.selectedUserRoles.map(role => UserRole[Number(role.code)]),
      departmentIds: this.selectedDepartments.map(department => department.id),
    } as UserMapping;
    this.userService.updateUser(this.user!.id!, updatedUser).subscribe({
      next: (response) => {
        if (response) {
          let updatedUser = Mapper.map("MappingToUser", response) as User;
          this.editedUserEmitter.emit(updatedUser);
        }
      },
      error: (err) => {
        console.error('Failed to create user:', err);
        this.messageService.add({ severity: 'error', summary: this.faultyEditUserTitleLabel , detail: this.faultyEditUserDetailsLabel });
      },
      complete: () => {
        this.closeModal.emit(false);
      }
    });
  }

  private updateLabels() {
    this.nameLabel = this.translate.instant('admin.edit-popup.name');
    this.surnameLabel = this.translate.instant('admin.edit-popup.surname');
    this.emailLabel = this.translate.instant('admin.edit-popup.email');
    this.identificationTypeLabel = this.translate.instant('admin.edit-popup.id-type');
    this.identificationNumberLabel = this.translate.instant('admin.edit-popup.id-number');
    this.rolesLabel = this.translate.instant('admin.edit-popup.roles');
    this.departmentsLabel = this.translate.instant('admin.edit-popup.departments');
    this.updateButtonLabel = this.translate.instant('admin.edit-popup.update-button');
    this.discardButtonLabel = this.translate.instant('admin.edit-popup.discard-button');
    this.descriptionLabel = this.translate.instant('admin.edit-popup.description');
    this.activeUserLabel = this.translate.instant('admin.edit-popup.active-user');
    this.inactiveUserLabel = this.translate.instant('admin.edit-popup.inactive-user');
    this.faultyEditUserTitleLabel = this.translate.instant('admin.edit-popup.faulty-edit-title');
    this.faultyEditUserDetailsLabel = this.translate.instant('admin.edit-popup.faulty-edit-details');
    this.spinnerService.hide();
  }

  private updateData() {
    //this.updateDepartments();
    this.updateIdentityTypes();
    this.updateRoles();
  }

  private updateRoles() {
    this.userRoles = [];
    Object.keys(UserRole).filter(key => isNaN(Number(UserRole[key as keyof typeof UserRole]))).forEach(key => {
      var keyTranslation = this.translate.instant(`roles.${key}`);
      this.userRoles.push({ name: keyTranslation, code: key });
    });
  }

  private updateIdentityTypes() {
    this.identityTypes = [];
    Object.keys(IdentityType).filter(key => isNaN(Number(IdentityType[key as keyof typeof IdentityType]))).forEach(key => {
      var keyTranslation = this.translate.instant(`identity-types.${key}`);
      this.identityTypes.push({ name: keyTranslation, code: key });
    });
  }

  private updateDepartments() {
    this.departmentService.getAllDepartments().subscribe((departments) => {
      this.departments = departments;
    });
  }

  private checkUserData() {
    this.checkUserDepartments();
    this.checkUserIdentityType();
    this.checkUserRoles();
  }

  private checkUserRoles() {
    this.selectedUserRoles = [];
    this.userRoles.forEach(role => {
      if (this.user?.roles.includes(Number(role.code))) {
        this.selectedUserRoles.push(role);
      }
    });
  }

  private checkUserIdentityType() {
    this.identityTypes.forEach(type => {
      if (type.code == this.user?.identityType) {
        this.selectedIdentityType = type;
      }
    });
  }

  private checkUserDepartments() {
    this.selectedDepartments = [];
    var userDepartmentsId = this.user?.departments.map(department => department.id);
    this.departments.forEach(department => {
      if (userDepartmentsId?.includes(department.id)) {
        this.selectedDepartments.push(department);
      }
    })
  }
}
