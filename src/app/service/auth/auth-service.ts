
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ActionEnum } from '../../enums/action-enum';
import { AuthActionEnum } from './auth-action-enum';
import { Observable } from 'rxjs';
import { TokenRequest } from '../../model/request/token-request.model';
import { TokenResponse } from '../../model/response/token-response.model';
import { Constants } from '../../constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  public login(credentials: TokenRequest): Observable<TokenResponse> {
    const url = AuthActionEnum.toUrl(AuthActionEnum.LOGIN);
    return this.http.post<TokenResponse>(url, credentials);
  }
}
