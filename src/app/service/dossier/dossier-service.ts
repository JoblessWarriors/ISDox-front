import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DossierMapping } from '../../model/dossier/dossier-mapping.model';
import { DossierActionEnum } from './dossier-action-enum';
import { DossiersResponse } from '../../model/response/dossiers-response.model';
import { UrlParamsService } from '../url-params/url-params-service';

@Injectable({
  providedIn: 'root',
})
export class DossierService {
  private http = inject(HttpClient);

  public getAllDossiers(param?: Record<string, any>): Observable<DossiersResponse> {
    let url = DossierActionEnum.toUrl(DossierActionEnum.GET);
    if (param) {
      url += UrlParamsService.buildQueryString(param);
    }
    return this.http.get<DossiersResponse>(url);
  }

  public getAllDocumentPreviews(id: string): Observable<Record<string, string>> {
    const url = DossierActionEnum.toUrl(DossierActionEnum.GET_PREVIEWS, id);
    return this.http.get<Record<string, string>>(url);
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
