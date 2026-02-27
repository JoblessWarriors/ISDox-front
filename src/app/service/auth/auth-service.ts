
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ActionEnum } from '../../enums/action-enum';
import { AuthActionEnum } from './auth-action-enum';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { TokenRequest } from '../../model/request/token-request.model';
import { TokenResponse } from '../../model/response/token-response.model';
import { Constants } from '../../constants';
import { LogInError } from '../../errors/login/log-in-error';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = Constants.baseUrl;
  private action: string = ActionEnum.AUTH;

  public logInAsync(credentials: TokenRequest): Observable<TokenResponse> {
    const url = AuthActionEnum.toUrl(AuthActionEnum.LOGIN);
    return this.http.post<TokenResponse>(url, credentials);
  }
}
