import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserRole } from './user-role';
import { map, Observable } from 'rxjs';

@Pipe({
  name: 'userRoleDescription',
})
export class UserRoleDescriptionPipe implements PipeTransform {
  private translate = inject(TranslateService);

  transform(role: UserRole): Observable<string> {
    const key = `roles.${role}`;
    return this.translate.stream(key).pipe(
      map(translation => translation || role)
    );
  }
}
