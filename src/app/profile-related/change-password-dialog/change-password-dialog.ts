import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordService } from '../../service/password/password-service';
import { PasswordModule } from 'primeng/password';
import { UserService } from '../../service/user/user-service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-change-password-dialog',
  imports: [
    CommonModule,
    DialogModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
    InputGroupModule,
    PasswordModule
  ],
  templateUrl: './change-password-dialog.html',
  styleUrl: './change-password-dialog.css',
})
export class ChangePasswordDialog implements OnInit {
  @Input() isVisible: boolean = false;
  @Input() userId: string = '';
  @Output() closeModal = new EventEmitter<boolean>();
  @Output() changedPasswordEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  private translate = inject(TranslateService);
  private passwordService = inject(PasswordService);
  private userService = inject(UserService);
  private messageService = inject(MessageService);

  protected oldPassword = '';
  protected newPassword = '';
  protected confirmPassword = '';
  protected passwordErrors: string[] = [];

  protected titleLabel: string = '';
  protected descriptionLabel: string = '';
  protected oldPasswordLabel: string = '';
  protected newPasswordLabel: string = '';
  protected confirmPasswordLabel: string = '';
  protected discardButtonLabel: string = '';
  protected changePasswordButtonLabel: string = '';
  protected faultyChangePasswordTitleLabel: string = '';
  protected faultyChangePasswordDetailsLabel: string = '';

  ngOnInit(): void {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateLabels();
    });

    this.updateLabels();
  }

  protected validatePasswords() {
    if (!this.newPassword && !this.confirmPassword) {
        this.passwordErrors = [];
        return;
    }
    const result = this.passwordService.validatePassword(this.newPassword, this.confirmPassword);
    this.passwordErrors = result.errors.map(err => this.translate.instant(`profile.password-errors.${err}`));
  }

  protected isFormValid(): boolean {
    return this.oldPassword.length > 0 && 
           this.newPassword.length > 0 && 
           this.passwordErrors.length === 0;
  }

  protected onDiscard() {
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.passwordErrors = [];
    this.closeModal.emit(false);
  }

  protected updatePassword() {
    const body = {
      oldPassword: this.oldPassword,
      newPassword: this.newPassword,
      confirmedPassword: this.confirmPassword
    };
    this.userService.changePassword(this.userId, body).subscribe({
      next: () => {
        this.changedPasswordEmitter.emit(true);
        this.closeModal.emit(false);
      },
      error: (err) => {
        console.error('Failed to edit department:', err);
        this.messageService.add({ severity: 'error', summary: this.faultyChangePasswordTitleLabel , detail: this.faultyChangePasswordDetailsLabel });
      }
    });
  }

  private updateLabels() {
    this.titleLabel = this.translate.instant('profile.change-password-dialog.change-password-title');
    this.descriptionLabel = this.translate.instant('profile.change-password-dialog.change-password-description');
    this.oldPasswordLabel = this.translate.instant('profile.change-password-dialog.old-password');
    this.newPasswordLabel = this.translate.instant('profile.change-password-dialog.new-password');
    this.confirmPasswordLabel = this.translate.instant('profile.change-password-dialog.confirm-password');
    this.discardButtonLabel = this.translate.instant('profile.change-password-dialog.discard');
    this.changePasswordButtonLabel = this.translate.instant('profile.change-password-dialog.change-password-button');
    this.faultyChangePasswordTitleLabel = this.translate.instant('profile.change-password-dialog.faulty-change-password-title');
    this.faultyChangePasswordDetailsLabel = this.translate.instant('profile.change-password-dialog.faulty-change-password-details');
  }
}
