import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { UserService } from '../../service/user/user-service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-change-profile-picture-dialog',
  imports: [
    AvatarModule,
    DialogModule,
    ButtonModule,
    FileUploadModule
  ],
  templateUrl: './change-profile-picture-dialog.html',
  styleUrl: './change-profile-picture-dialog.css',
})
export class ChangeProfilePictureDialog implements OnInit{
  @Input() isVisible: boolean = false;
  @Input() user: any; 
  @Output() closeModal = new EventEmitter<boolean>();
  @Output() changedProfilePicture = new EventEmitter<string>();

  private translate = inject(TranslateService);
  private userService = inject(UserService);
  private messageService = inject(MessageService);

  protected imagePreview: string | null = null;
  protected selectedFile: File | null = null;
  protected defaultAvatarUrl = 'assets/images/default-avatar.png'; // Your SVG or fallback

  protected titleLabel = '';
  protected descriptionLabel = '';
  protected uploadButtonLabel = '';
  protected discardButtonLabel = '';
  protected saveButtonLabel = '';
  protected maxFileSizeLabel = '';
  private faultyChangeProfilePictureTitleLabel: string = '';
  private faultyChangeProfilePictureDetailsLabel: string = '';

  ngOnInit(): void {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateLabels();
    });

    this.updateLabels();
  }

  onFileSelect(event: any) {
    this.selectedFile = event.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onDiscard() {
    this.imagePreview = null;
    this.selectedFile = null;
    this.closeModal.emit(false);
  }

  onUpload() {
    if (this.selectedFile) {
      this.userService.changeProfilePicture(this.user.id, this.selectedFile).subscribe({
        next: (response) => {
          if (response && response.profileImageUrl != '') {
            this.changedProfilePicture.emit(response.profileImageUrl);
            this.closeModal.emit(false);
          }
        },
        error: (err) => {
          console.error('Failed to change profile picture:', err);
          this.messageService.add({ severity: 'error', summary: this.faultyChangeProfilePictureTitleLabel , detail: this.faultyChangeProfilePictureDetailsLabel });
        }
      });
    }
  }

  private updateLabels() {
    this.titleLabel = this.translate.instant('profile.picture-dialog.title');
    this.descriptionLabel = this.translate.instant('profile.picture-dialog.description');
    this.uploadButtonLabel = this.translate.instant('profile.picture-dialog.upload-button');
    this.discardButtonLabel = this.translate.instant('profile.picture-dialog.discard');
    this.saveButtonLabel = this.translate.instant('profile.picture-dialog.save');
    this.maxFileSizeLabel = this.translate.instant('profile.picture-dialog.max-size');
    this.faultyChangeProfilePictureTitleLabel = this.translate.instant('profile.picture-dialog.faulty-change-profile-picture-title');
    this.faultyChangeProfilePictureDetailsLabel = this.translate.instant('profile.picture-dialog.faulty-change-profile-picture-details');
  }
}
