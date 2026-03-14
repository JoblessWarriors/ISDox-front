import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { InstitutionActionEnum } from './institution-action-enum';
import { Institution } from '../../model/institution/institution.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InstitutionService {
  private http = inject(HttpClient);

  public getAllInstitutions() {

  }

  public getInstitution(id: string): Observable<Institution> {
    const url = InstitutionActionEnum.toUrl(InstitutionActionEnum.GET, id);
    return this.http.get<Institution>(url);
  }
}
