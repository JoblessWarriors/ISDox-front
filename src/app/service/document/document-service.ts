import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DocumentActionEnum } from './document-action-enum';
import { Observable } from 'rxjs';
import { DocumentMapping } from '../../model/document/document-mapping.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private http = inject(HttpClient);

  public uploadDocument(dossierId: string, file: File, documentTypeId?: string): Observable<DocumentMapping> {
    const url = DocumentActionEnum.toUrl(DocumentActionEnum.UPLOAD, dossierId, true);
    const formData = new FormData();
    formData.append('file', file, file.name);
    if (documentTypeId) {
      formData.append('documentTypeId', documentTypeId);
    }   
    return this.http.post<DocumentMapping>(url, formData);
  }

  public updateDocument(documentId: string, document: DocumentMapping): Observable<DocumentMapping> {
    const url = DocumentActionEnum.toUrl(DocumentActionEnum.UPDATE, documentId);
    return this.http.put<DocumentMapping>(url, document);
  }
}
