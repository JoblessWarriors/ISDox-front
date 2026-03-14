import { inject, Injectable } from '@angular/core';
import { User } from '../../model/user/user.model';
import { UserRole } from '../../model/user/user-role';
import { IdentityType } from '../../model/user/identity-type';
import { HttpClient } from '@angular/common/http';
import { UserActionEnum } from './user-action-enum';
import { Institution } from '../../model/institution/institution.model';
import { UserMapping } from '../../model/user/user-mapping.model';
import { UsersResponse } from '../../model/response/users-response.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  public getUserRoles(user: User) {
    return user.roles;
  }

  public getAllUsers(): Observable<UsersResponse> {
    const url = UserActionEnum.toUrl(UserActionEnum.GET);
    return this.http.get<UsersResponse>(url);
  }

  public getUser(id: string) {

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
}
