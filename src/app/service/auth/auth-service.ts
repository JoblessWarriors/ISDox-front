
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ActionEnum } from '../../enums/action-enum';
import { LogInRequest } from '../../model/request/log-in-request.model';
import { AuthActionEnum } from './auth-action-enum';
import { tap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { LogInResponse } from '../../model/response/log-in-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient)
  private cookieService = inject(CookieService);
  private action: string = ActionEnum.AUTH;

  public logInAsync(credentials: LogInRequest) {
    const url = `${this.action}/${AuthActionEnum.LOGIN}`
    this.http.post<LogInResponse>(url, credentials)
    // .pipe(
    //   tap((response: LogInResponse) => {
    //     if (response.access_token && response.token_type) {
    //       this.cookieService.set('ISDox_access_token', response.access_token, {})
    //     }
    //   }),
    //   map(() => true), // Return true if successful
    //   catchError((error: HttpErrorResponse) => {
    //     // 1. Log the error for debugging
    //     console.error('Login failed', error);

    //     // 2. Handle specific status codes
    //     if (error.status === 401) {
    //       alert('Invalid username or password.');
    //     } else if (error.status === 0) {
    //       alert('Server is unreachable. Check your internet connection.');
    //     }

    //     // 3. Re-throw the error so the Component knows it failed
    //     return throwError(() => new Error(error.message || 'Server Error'));
        
    //     // ALTERNATIVE: return of(false); 
    //     // Use "of(false)" if you want the component to just receive a 'false' value instead of a crash.
    //   })
    // );
  }
}
