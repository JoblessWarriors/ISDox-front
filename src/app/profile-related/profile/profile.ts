import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { User } from '../../model/user/user.model';
import { CommonModule, DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { PageEnum } from '../../enums/page-enum';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { SpinnerService } from '../../service/spinner/spinner-service';
import { TooltipModule } from 'primeng/tooltip';
import { AuthService } from '../../service/auth/auth-service';
import { UserService } from '../../service/user/user-service';
import { Mapper } from '../../model/mapper/mapper';
import { MessageService } from 'primeng/api';
import { IdentityType } from '../../model/user/identity-type';
import { UserRole } from '../../model/user/user-role';
import { ChangePasswordDialog } from '../change-password-dialog/change-password-dialog';
import { ChangeProfilePictureDialog } from '../change-profile-picture-dialog/change-profile-picture-dialog';


@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    CardModule,
    AvatarModule,
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
    ChipModule,
    TagModule,
    DividerModule,
    DatePipe,
    TooltipModule,
    ChangePasswordDialog,
    ChangeProfilePictureDialog
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private cookieService = inject(CookieService);
  private translate = inject(TranslateService);
  private spinnerService = inject(SpinnerService);
  private userService = inject(UserService);
  private messageService = inject(MessageService);
  private cd: ChangeDetectorRef = inject(ChangeDetectorRef);
  
  protected user: User | undefined;
  protected readonly IdentityType = IdentityType;
  protected readonly UserRole = UserRole;
  protected userProfilePic: string | undefined;
  protected openChangePasswordDialog: boolean = false;
  protected openChangeProfilePictureDialog: boolean = false;
  
  protected profileDetailsLabel: string = '';
  protected identificationLabel: string = '';
  protected affiliationLabel: string = '';
  protected permissionsLabel: string = '';
  protected firstNameLabel: string = '';
  protected lastNameLabel: string = '';
  protected emailLabel: string = '';
  protected identityTypeLabel: string = '';
  protected identityNumberLabel: string = '';
  protected institutionLabel: string = '';
  protected departmentsLabel: string = '';
  protected changePasswordButtonLabel: string = '';
  protected changePhotoButtonTooltipLabel: string = '';
  protected accountActiveLabel: string = '';
  protected accountIdLabel: string = '';
  protected memberSinceLabel: string = '';
  protected createdByLabel: string = '';
  protected pendingLabel: string = '';
  protected faultyGetCurrentUserTitleLabel: string = '';
  protected faultyGetCurrentUserDetailsLabel: string = '';
  protected truthyChangePasswordTitleLabel: string = '';
  protected truthyChangePasswordDetailsLabel: string = '';
  protected truthyChangeProfilePictureTitleLabel: string = '';
  protected truthyChangeProfilePictureDetailsLabel: string = '';

  ngOnInit() {
    this.cookieService.set('ISDox_lastVisitedPage', PageEnum.PROFILE, 
      { path: '/', sameSite: 'Strict' });

    this.spinnerService.show();
    this.userService.getCurrentUser().subscribe({
      next: (userMapping) => {
        if (userMapping) {
          this.user = Mapper.map("MappingToUser", userMapping);
          this.userProfilePic = this.user?.profileImageUrl;
          this.cd.detectChanges();
        }
        this.spinnerService.hide();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: this.faultyGetCurrentUserTitleLabel , detail: this.faultyGetCurrentUserDetailsLabel });
        console.error('Failed to load current user:', err);
        this.spinnerService.hide();
      }
    });

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.spinnerService.show();
      this.updateLabels();
      this.spinnerService.hide();
    });

    this.updateLabels();
  }

  protected onChangeProfilePicture() {
    this.openChangeProfilePictureDialog = true;
  }

  protected onChangePassword() {
    this.openChangePasswordDialog = true;
  }

  protected changedPasswordEvent(isChanged: boolean) {
    this.messageService.add({ severity: 'success', summary: this.truthyChangePasswordTitleLabel , detail: this.truthyChangePasswordDetailsLabel });
  }

  changedProfilePictureEvent(event: string) {
    this.userProfilePic = event;
    this.messageService.add({ severity: 'success', summary: this.truthyChangeProfilePictureTitleLabel , detail: this.truthyChangeProfilePictureDetailsLabel });
    this.cd.detectChanges();
  }

  private updateLabels() {
    this.profileDetailsLabel = this.translate.instant('profile.profile-details');
    this.identificationLabel = this.translate.instant('profile.identification-header');
    this.affiliationLabel = this.translate.instant('profile.affiliation-header');
    this.permissionsLabel = this.translate.instant('profile.permissions-header');
    this.firstNameLabel = this.translate.instant('profile.first-name');
    this.lastNameLabel = this.translate.instant('profile.last-name');
    this.emailLabel = this.translate.instant('profile.email');
    this.identityTypeLabel = this.translate.instant('profile.identity-type');
    this.identityNumberLabel = this.translate.instant('profile.identity-number');
    this.institutionLabel = this.translate.instant('profile.institution');
    this.departmentsLabel = this.translate.instant('profile.departments');
    this.changePasswordButtonLabel = this.translate.instant('profile.change-password');
    this.changePhotoButtonTooltipLabel = this.translate.instant('profile.change-photo-tooltip');
    this.accountActiveLabel = this.translate.instant('profile.account-active');
    this.accountIdLabel = this.translate.instant('profile.account-id');
    this.memberSinceLabel = this.translate.instant('profile.member-since');
    this.createdByLabel = this.translate.instant('profile.created-by');
    this.pendingLabel = this.translate.instant('profile.pending');
    this.faultyGetCurrentUserTitleLabel = this.translate.instant('profile.faulty-get-current-user-title');
    this.faultyGetCurrentUserDetailsLabel = this.translate.instant('profile.faulty-get-current-user-details');
    this.truthyChangePasswordTitleLabel = this.translate.instant('profile.truthy-change-password-title');
    this.truthyChangePasswordDetailsLabel = this.translate.instant('profile.truthy-change-password-details');
    this.truthyChangeProfilePictureTitleLabel = this.translate.instant('profile.truthy-change-profile-picture-title');
    this.truthyChangeProfilePictureDetailsLabel = this.translate.instant('profile.truthy-change-profile-picture-details');
  }
}
