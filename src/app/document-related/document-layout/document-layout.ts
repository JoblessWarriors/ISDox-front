import { Component, inject, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { PageEnum } from '../../enums/page-enum';
import { Documents } from '../documents/documents';
import { DocumentRegister } from '../document-register/document-register';
import { AuthService } from '../../service/auth/auth-service';
import { UserRole } from '../../model/user/user-role';
import { DocumentSolve } from '../document-solve/document-solve';

@Component({
  selector: 'app-document-layout',
  imports: [
    Documents,
    DocumentRegister,
    DocumentSolve
  ],
  templateUrl: './document-layout.html',
  styleUrl: './document-layout.css',
})
export class DocumentLayout implements OnInit {
  private cookieService = inject(CookieService);
  private authService = inject(AuthService);

  protected userRoles: UserRole[] = [];
  protected readonly UserRole = UserRole;

  ngOnInit(): void {
    this.cookieService.set('ISDox_lastVisitedPage', PageEnum.DOCUMENTS, 
      { path: '/', sameSite: 'Strict' });

    this.authService.rolesBehaviorSubject.subscribe((userRoles) => {
      this.userRoles = [...userRoles];
    });
  }
}
