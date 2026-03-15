import { ChangeDetectorRef, Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UserService } from '../../service/user/user-service';
import { SpinnerService } from '../../service/spinner/spinner-service';
import { DataViewModule } from 'primeng/dataview';
import { User } from '../../model/user/user.model';
import { CommonModule, Location } from '@angular/common';
import { ChipModule } from 'primeng/chip';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { UserRoleDescriptionPipe } from '../../model/user/user-role-description-pipe';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { TabsModule } from 'primeng/tabs';
import { AdminEditDialog } from '../admin-edit-dialog/admin-edit-dialog';
import { AdminCreateDialog } from "../admin-create-dialog/admin-create-dialog";
import { Mapper } from '../../model/mapper/mapper';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Department } from '../../model/department/department.model';
import { DepartmentService } from '../../service/department/department-service';
import { AdminCreateDepartmentDialog } from '../admin-create-department-dialog/admin-create-department-dialog';
import { AdminEditDepartmentDialog } from '../admin-edit-department-dialog/admin-edit-department-dialog';

@Component({
  selector: 'app-admin-homepage',
  imports: [
    CommonModule,
    DataViewModule,
    ChipModule,
    ButtonModule,
    TagModule,
    UserRoleDescriptionPipe,
    AdminEditDialog,
    TabsModule,
    AdminCreateDialog,
    ConfirmDialogModule,
    AdminCreateDepartmentDialog,
    AdminEditDepartmentDialog
],
  templateUrl: './admin-homepage.html',
  styleUrl: './admin-homepage.css',
})
export class AdminHomepage implements OnInit {
  private userService = inject(UserService);
  private spinnerService = inject(SpinnerService);
  private translate = inject(TranslateService);
  private messageService = inject(MessageService);
  private location = inject(Location);
  private confirmationService = inject(ConfirmationService);
  private departmentService = inject(DepartmentService);
  private cd: ChangeDetectorRef = inject(ChangeDetectorRef);

  protected users: User[] = [];
  protected selectedUser?: User;
  protected openEditUserDialog = false;
  protected openCreateUserDialog = false;

  protected departments: Department[] = [];
  protected selectedDepartment?: Department;
  protected openEditDepartmentDialog = false;
  protected openCreateDepartmentDialog = false;

  protected activeTabIndex: number = 0;

  protected usersTabLabel: string = '';
  protected departmentsTabLabel: string = '';
  protected addUserLabel: string = '';
  protected addDepartmentLabel: string = '';
  protected editButtonLabel: string = '';
  protected deleteButtonLabel: string = '';
  protected activeUserLabel: string = '';
  protected inactiveUserLabel: string = '';
  protected editDepartmentButtonLabel: string = '';
  protected deleteDepartmentButtonLabel: string = '';

  private truthyCreateUserTitleLabel: string = '';
  private truthyCreateUserDetailsLabel: string = '';
  private truthyCreateDepartmentTitleLabel: string = '';
  private truthyCreateDepartmentDetailsLabel: string = '';
  private truthyEditUserTitleLabel: string = '';
  private truthyEditUserDetailsLabel: string = '';
  private truthyEditDepartmentTitleLabel: string = '';
  private truthyEditDepartmentDetailsLabel: string = '';
  private faultyGetUsersTitleLabel: string = '';
  private faultyGetUsersDetailsLabel: string = '';

  private truthyDeleteUserTitleLabel: string = '';
  private truthyDeleteUserDetailsLabel: string = '';
  private faultyDeleteUserTitleLabel: string = '';
  private faultyDeleteUserDetailsLabel: string = '';
  private deleteUserConfirmDialogMessageLabel: string = '';
  private deleteUserConfirmDialogHeaderLabel: string = '';
  private deleteUserConfirmDialogRejectLabel: string = '';
  private deleteUserConfirmDialogAcceptLabel: string = '';

  private truthyDeleteDepartmentTitleLabel: string = '';
  private truthyDeleteDepartmentDetailsLabel: string = '';
  private faultyDeleteDepartmentTitleLabel: string = '';
  private faultyDeleteDepartmentDetailsLabel: string = '';
  private deleteDepartmentConfirmDialogMessageLabel: string = '';
  private deleteDepartmentConfirmDialogHeaderLabel: string = '';
  private deleteDepartmentConfirmDialogRejectLabel: string = '';
  private deleteDepartmentConfirmDialogAcceptLabel: string = '';

  ngOnInit(): void {
    this.spinnerService.show();
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        if (response) {
          this.users = response.content.map(userMap => 
            Mapper.map("MappingToUser", userMap)
          );
          this.selectedUser = this.users[0];
          this.cd.detectChanges();
        }
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: this.faultyGetUsersTitleLabel , detail: this.faultyGetUsersDetailsLabel });
        console.error('Failed to load users:', err);
      }
    });

    this.departmentService.getAllDepartments().subscribe({
      next: (response) => {
        if (response) {
          this.departments = response;
          this.selectedDepartment = this.departments[0];
          this.cd.detectChanges();
        }
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: this.faultyGetUsersTitleLabel , detail: this.faultyGetUsersDetailsLabel });
        console.error('Failed to load users:', err);
      }
    });

    this.location.replaceState('');
    this.translate.use('en-US');

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.spinnerService.show();
      this.updateLabels();
    });

    this.updateLabels();
  }

  protected deleteUser(deletedUser: User) {
    this.confirmationService.confirm({
      message: this.deleteUserConfirmDialogMessageLabel,
      header: this.deleteUserConfirmDialogHeaderLabel,
      icon: 'pi pi-info-circle',
      rejectLabel: this.deleteUserConfirmDialogRejectLabel,
      rejectButtonProps: {
        label: this.deleteUserConfirmDialogRejectLabel,
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: this.deleteUserConfirmDialogAcceptLabel,
        severity: 'primary'
      },
      accept: () => {
        this.userService.deleteUser(deletedUser.id!).subscribe({
          next: (response) => {
            if (!response) {
              this.users = this.users.filter(user => user.id != deletedUser.id);
            }
          },
          error: (err) => {
            console.log('Failed to delete user:' + err);
            this.messageService.add({ severity: 'error', summary: this.faultyDeleteUserTitleLabel , detail: this.faultyDeleteUserDetailsLabel });
          },
          complete: () => {
            this.messageService.add({ severity: 'success', summary: this.truthyDeleteUserTitleLabel , detail: this.truthyDeleteUserDetailsLabel });
          }
        });
      },
      reject: () => {
      }
    });
  }

  protected editUser(user: User) {
    this.openEditUserDialog = true;
    this.selectedUser = user;
  }

  protected editedUserEvent(editedUser: User) {
    this.messageService.add({ severity: 'success', summary: this.truthyEditUserTitleLabel , detail: this.truthyEditUserDetailsLabel });
    this.users = this.users.map(user => 
      user.id === editedUser.id ? { ...editedUser } : user
    );
  }

  protected createdUserEvent(createdUser: User) {
    this.messageService.add({ severity: 'success', summary: this.truthyCreateUserTitleLabel , detail: this.truthyCreateUserDetailsLabel });
    this.users.push({ ...createdUser});
  }

  protected createUser() {
    this.openCreateUserDialog = true;
  }

  protected createDepartment() {
    this.openCreateDepartmentDialog = true;
  }

  protected createdDepartmentEvent(department: Department) {
    this.messageService.add({ severity: 'success', summary: this.truthyCreateDepartmentTitleLabel , detail: this.truthyCreateDepartmentDetailsLabel });
    this.departments.push({ ...department});
  }

  protected editDepartment(department: Department) {
    this.selectedDepartment = department;
    this.openEditDepartmentDialog = true;
  }

  protected editedDepartmentEvent(editedDepartment: Department) {
    this.messageService.add({ severity: 'success', summary: this.truthyEditDepartmentTitleLabel , detail: this.truthyEditDepartmentDetailsLabel });
    this.departments = this.departments.map(department => 
      department.id === editedDepartment.id ? { ...editedDepartment } : department
    );
  }

  protected deleteDepartment(deletedDepartment: any) {
  this.confirmationService.confirm({
      message: this.deleteDepartmentConfirmDialogMessageLabel,
      header: this.deleteDepartmentConfirmDialogHeaderLabel,
      icon: 'pi pi-info-circle',
      rejectLabel: this.deleteDepartmentConfirmDialogRejectLabel,
      rejectButtonProps: {
        label: this.deleteDepartmentConfirmDialogRejectLabel,
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: this.deleteDepartmentConfirmDialogAcceptLabel,
        severity: 'primary'
      },
      accept: () => {
        this.departmentService.deleteDepartment(deletedDepartment.id!).subscribe({
          next: (response) => {
            if (!response) {
              this.departments = this.departments.filter(department => department.id != deletedDepartment.id);
            }
          },
          error: (err) => {
            console.log('Failed to delete department:' + err);
            this.messageService.add({ severity: 'error', summary: this.faultyDeleteDepartmentTitleLabel , detail: this.faultyDeleteDepartmentDetailsLabel });
          },
          complete: () => {
            this.messageService.add({ severity: 'success', summary: this.truthyDeleteDepartmentTitleLabel , detail: this.truthyDeleteDepartmentDetailsLabel });
          }
        });
      },
      reject: () => {
      }
    });
  }

  private updateLabels() {
    this.usersTabLabel = this.translate.instant('admin.homepage.users-tab');
    this.departmentsTabLabel = this.translate.instant('admin.homepage.departments-tab');
    this.addUserLabel = this.translate.instant('admin.homepage.add-user-button');
    this.addDepartmentLabel = this.translate.instant('admin.homepage.add-department-button');
    this.editButtonLabel = this.translate.instant('admin.homepage.edit-button');
    this.deleteButtonLabel = this.translate.instant('admin.homepage.delete-button');
    this.editDepartmentButtonLabel = this.translate.instant('admin.homepage.edit-department-button');
    this.deleteDepartmentButtonLabel = this.translate.instant('admin.homepage.delete-department-button');
    this.activeUserLabel = this.translate.instant('admin.homepage.active-user');
    this.inactiveUserLabel = this.translate.instant('admin.homepage.inactive-user');

    this.truthyCreateUserTitleLabel = this.translate.instant('admin.homepage.truthy-create-user-title');
    this.truthyCreateUserDetailsLabel = this.translate.instant('admin.homepage.truthy-create-user-details');
    this.truthyCreateDepartmentTitleLabel = this.translate.instant('admin.homepage.truthy-create-department-title');
    this.truthyCreateDepartmentDetailsLabel = this.translate.instant('admin.homepage.truthy-create-department-details');
    this.truthyEditUserTitleLabel = this.translate.instant('admin.homepage.truthy-edit-user-title');
    this.truthyEditUserDetailsLabel = this.translate.instant('admin.homepage.truthy-edit-user-details');
    this.truthyEditDepartmentTitleLabel = this.translate.instant('admin.homepage.truthy-edit-department-title');
    this.truthyEditDepartmentDetailsLabel = this.translate.instant('admin.homepage.truthy-edit-department-details');
    this.faultyGetUsersTitleLabel = this.translate.instant('admin.homepage.faulty-get-users-title');
    this.faultyGetUsersDetailsLabel = this.translate.instant('admin.homepage.faulty-get-users-details');

    this.truthyDeleteUserTitleLabel = this.translate.instant('admin.homepage.truthy-delete-user-title');
    this.truthyDeleteUserDetailsLabel = this.translate.instant('admin.homepage.truthy-delete-user-details');
    this.faultyDeleteUserTitleLabel = this.translate.instant('admin.homepage.faulty-delete-user-title');
    this.faultyDeleteUserDetailsLabel  = this.translate.instant('admin.homepage.faulty-delete-user-details');
    this.deleteUserConfirmDialogMessageLabel = this.translate.instant('admin.homepage.delete-user-confirm-dialog-message');
    this.deleteUserConfirmDialogHeaderLabel = this.translate.instant('admin.homepage.delete-user-confirm-dialog-header');
    this.deleteUserConfirmDialogRejectLabel = this.translate.instant('admin.homepage.delete-user-confirm-dialog-reject');
    this.deleteUserConfirmDialogAcceptLabel = this.translate.instant('admin.homepage.delete-user-confirm-dialog-accept');

    this.truthyDeleteDepartmentTitleLabel = this.translate.instant('admin.homepage.truthy-delete-department-title');
    this.truthyDeleteDepartmentDetailsLabel = this.translate.instant('admin.homepage.truthy-delete-department-details');
    this.faultyDeleteDepartmentTitleLabel = this.translate.instant('admin.homepage.faulty-delete-department-title');
    this.faultyDeleteDepartmentDetailsLabel  = this.translate.instant('admin.homepage.faulty-delete-department-details');
    this.deleteDepartmentConfirmDialogMessageLabel = this.translate.instant('admin.homepage.delete-department-confirm-dialog-message');
    this.deleteDepartmentConfirmDialogHeaderLabel = this.translate.instant('admin.homepage.delete-department-confirm-dialog-header');
    this.deleteDepartmentConfirmDialogRejectLabel = this.translate.instant('admin.homepage.delete-department-confirm-dialog-reject');
    this.deleteDepartmentConfirmDialogAcceptLabel = this.translate.instant('admin.homepage.delete-department-confirm-dialog-accept');
    this.spinnerService.hide();
  }
}
