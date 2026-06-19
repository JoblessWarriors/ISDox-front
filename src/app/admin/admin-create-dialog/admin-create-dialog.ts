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
import { AuthService } from '../../service/auth/auth-service';

@Component({
  selector: 'app-admin-create-dialog',
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
  templateUrl: './admin-create-dialog.html',
  styleUrl: './admin-create-dialog.css',
})
export class AdminCreateDialog implements OnChanges {
  @Input() isVisible: boolean = false;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() createdUserEmitter: EventEmitter<User> = new EventEmitter<User>();

  private translate = inject(TranslateService);
  private spinnerService = inject(SpinnerService);
  private departmentService = inject(DepartmentService);
  private userService = inject(UserService);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);

  protected titleLabel: string = '';
  protected nameLabel: string = '';
  protected surnameLabel: string = '';
  protected emailLabel: string = '';
  protected identificationTypeLabel: string = '';
  protected identificationNumberLabel: string = '';
  protected rolesLabel: string = "";
  protected departmentsLabel: string = '';
  protected createButtonLabel: string = '';
  protected discardButtonLabel: string = '';
  protected descriptionLabel: string = '';

  private faultyCreateUserTitleLabel: string = '';
  private faultyCreateUserDetailsLabel: string = '';

  protected user: any = {
    email: '',
    firstName: '',
    lastName: '',
    identityNumber: ''
  };

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
      this.updateLabels();
    });

    this.spinnerService.show();
    this.updateData();
    this.updateLabels();
  }

  protected createUser() {
    const createdUser = {
      email: this.user.email,
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      identityType: IdentityType[Number(this.selectedIdentityType.code)],
      identityNumber: this.user.identityNumber,
      departmentIds: this.selectedDepartments.map(department => department.id),
      roles: this.selectedUserRoles.map(role => UserRole[role.code])
    } as UserMapping;
    this.userService.createUser(createdUser).subscribe({
      next: (response) => {
        if (response) {
          let newUser = Mapper.map("MappingToUser", response) as User;
          this.createdUserEmitter.emit(newUser);
        }
      },
      error: (err) => {
        console.error('Failed to create user:', err);
        this.messageService.add({ severity: 'error', summary: this.faultyCreateUserTitleLabel , detail: this.faultyCreateUserDetailsLabel });
      },
      complete: () => {
        this.closeModal.emit(false);
      }
    });
  }

  private updateLabels() {
    this.titleLabel = this.translate.instant('admin.create-popup.title');
    this.nameLabel = this.translate.instant('admin.create-popup.name');
    this.surnameLabel = this.translate.instant('admin.create-popup.surname');
    this.emailLabel = this.translate.instant('admin.create-popup.email');
    this.identificationTypeLabel = this.translate.instant('admin.create-popup.id-type');
    this.identificationNumberLabel = this.translate.instant('admin.create-popup.id-number');
    this.rolesLabel = this.translate.instant('admin.create-popup.roles');
    this.departmentsLabel = this.translate.instant('admin.create-popup.departments');
    this.createButtonLabel = this.translate.instant('admin.create-popup.create-button');
    this.discardButtonLabel = this.translate.instant('admin.create-popup.discard-button');
    this.descriptionLabel = this.translate.instant('admin.create-popup.description');
    this.faultyCreateUserTitleLabel = this.translate.instant('admin.create-popup.faulty-create-title');
    this.faultyCreateUserDetailsLabel = this.translate.instant('admin.create-popup.faulty-create-details');
    this.spinnerService.hide();
  }

  private updateData() {
    this.updateDepartments();
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

}
