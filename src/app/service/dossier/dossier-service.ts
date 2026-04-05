import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DossierMapping } from '../../model/dossier/dossier-mapping.model';
import { DossierActionEnum } from './dossier-action-enum';
import { DossiersResponse } from '../../model/response/dossiers-response.model';

@Injectable({
  providedIn: 'root',
})
export class DossierService {
  private http = inject(HttpClient);

  public getAllDossiers(): Observable<DossiersResponse> {
    const url = DossierActionEnum.toUrl(DossierActionEnum.GET);
    return this.http.get<DossiersResponse>(url);
  }

  public getDossier(id: string): Observable<DossierMapping> {
    const url = DossierActionEnum.toUrl(DossierActionEnum.GET, id);
    return this.http.get<DossierMapping>(url);
  }

  public createDossier(): Observable<DossierMapping> {
    const url = DossierActionEnum.toUrl(DossierActionEnum.POST);
    return this.http.post<DossierMapping>(url, null);
  }

  public patchDossier(id: string, status: string) {
    const url = DossierActionEnum.toUrl(DossierActionEnum.PATCH, id);
    const body = {
      status: status
    };
    return this.http.patch<DossierMapping>(url, body);
  }
}
