import { DossierActionEnum } from "../dossier/dossier-action-enum";

export enum DocumentActionEnum {
    GET = 'documents',
    CREATE = 'documents',
    UPDATE = 'documents',
    DELETE = 'documents'
}

export namespace DocumentActionEnum {
  export function toUrl(action: DocumentActionEnum, dossierId: any, param?: any): string {
    const baseUrl = DossierActionEnum.toUrl(DossierActionEnum.GET, dossierId);
    if (param !== undefined) {
      return `${baseUrl}//${action}/${param}`;
    }
    return `${baseUrl}/${action}`;
  }
}