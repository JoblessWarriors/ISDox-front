
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ActionEnum } from '../../enums/action-enum';
import { AuthActionEnum } from './auth-action-enum';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { TokenRequest } from '../../model/request/token-request.model';
import { TokenResponse } from '../../model/response/token-response.model';
import { Constants } from '../../constants';
import { CookieService } from 'ngx-cookie-service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { InstitutionService } from '../institution/institution-service';
import { Institution } from '../../model/institution/institution.model';
import { UserRole } from '../../model/user/user-role';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public adminBehaviorSubject = new BehaviorSubject<boolean>(false);

  private http = inject(HttpClient);
  private cookieService = inject(CookieService);
  private jwtHelper = new JwtHelperService();
  private institutionService = inject(InstitutionService);
  private location = inject(Location);

  public login(credentials: TokenRequest): Observable<TokenResponse> {
    const url = AuthActionEnum.toUrl(AuthActionEnum.LOGIN);
    return this.http.post<TokenResponse>(url, credentials);
  }

  public logout() {
    if (this.cookieService.check('ISDox_access_token')) {
      this.cookieService.delete('ISDox_access_token');
    }
  }

  public isLoggedIn() {
    const isCookiePresent = this.cookieService.check('ISDox_access_token');
    if (!isCookiePresent) {
      return false;
    }
    return true;
  }

  public isAdmin() {
    const userData = this.getUserData();
    if (userData === null) {
      this.adminBehaviorSubject.next(false);
      return;
    }
    const isUserAdmin = userData.roles.includes(UserRole[UserRole.SUPER_ADMIN]);
    if (isUserAdmin) {
      this.adminBehaviorSubject.next(true);
      this.location.replaceState('');
    } 
    else {
      this.adminBehaviorSubject.next(false);
    }
    return;
  }

  public getUserData() {
    if (!this.cookieService.check('ISDox_access_token')) {
      return null;
    }
    const token = this.cookieService.get('ISDox_access_token');
    const decodedToken = this.jwtHelper.decodeToken(token);

    return decodedToken;
  }

  public getInstitution(): Observable<Institution | null> {
    const userData = this.getUserData();
    if (userData === null) {
      return of(null);
    }
    const institutionId = userData.tenantId;
    return this.institutionService.getInstitution(institutionId);
  }
}
