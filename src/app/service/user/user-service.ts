import { inject, Injectable } from '@angular/core';
import { User } from '../../model/user/user.model';
import { HttpClient } from '@angular/common/http';
import { UserActionEnum } from './user-action-enum';
import { UserMapping } from '../../model/user/user-mapping.model';
import { UsersResponse } from '../../model/response/users-response.model';
import { Observable, of } from 'rxjs';
import { AuthService } from '../auth/auth-service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  public getUserRoles(user: User) {
    return user.roles;
  }

  public getAllUsers(): Observable<UsersResponse> {
    const url = UserActionEnum.toUrl(UserActionEnum.GET);
    return this.http.get<UsersResponse>(url);
  }

  public getUser(userId: string): Observable<UserMapping> {
    const url = UserActionEnum.toUrl(UserActionEnum.GET, userId);
    return this.http.get<UserMapping>(url);
  }

  public getCurrentUser(): Observable<UserMapping | undefined> {
    const decodedData = this.authService.getUserData();
    if (decodedData == null) {
      return of(undefined);
    }
    const userId = decodedData['userId'];
    return this.getUser(userId);
  }

  public createUser(user: UserMapping): Observable<UserMapping> {
    const url = UserActionEnum.toUrl(UserActionEnum.CREATE);
    return this.http.post<UserMapping>(url, user);
  }

  public updateUser(userId: string, user: UserMapping): Observable<UserMapping> {
    const url = UserActionEnum.toUrl(UserActionEnum.UPDATE, userId);
    return this.http.put<UserMapping>(url, user);
  }

  public deleteUser(id: string) {
    const url = UserActionEnum.toUrl(UserActionEnum.DELETE, id);
    return this.http.delete(url);
  }

  public changePassword(id: string, body: any) {
    const url = UserActionEnum.toUrl(UserActionEnum.CHANGE_PASSWORD, id);
    return this.http.put(url, body);
  }

  public changeProfilePicture(id: string, file: File): Observable<{ profileImageUrl: string }> {
    const url = UserActionEnum.toUrl(UserActionEnum.CHANGE_AVATAR, id);
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<{ profileImageUrl: string }>(url, formData);
  }
}
