import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DocumentType } from '../../model/document/document-type.model';
import { DocumentTypeActionEnum } from './document-type-action-enum';

@Injectable({
  providedIn: 'root',
})
export class DocumentTypeService {
  private http = inject(HttpClient);

  public getAllDocumentTypes(): Observable<DocumentType[]> {
    const url = DocumentTypeActionEnum.toUrl(DocumentTypeActionEnum.GET);
    return this.http.get<DocumentType[]>(url);
  }
}
