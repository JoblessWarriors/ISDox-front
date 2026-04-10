import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegistryEntryActionEnum } from './registry-entry-action-enum';

@Injectable({
  providedIn: 'root',
})
export class RegistryEntryService {
  private http = inject(HttpClient);

  public createRegistryEntry(body: any): Observable<any> {
    const url = RegistryEntryActionEnum.toUrl(RegistryEntryActionEnum.CREATE);
    return this.http.post<any>(url, body);
  }
}
