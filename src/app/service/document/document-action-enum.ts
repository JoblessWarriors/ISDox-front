import { Constants } from "../../constants";
import { DossierActionEnum } from "../dossier/dossier-action-enum";

export enum DocumentActionEnum {
    GET = 'documents',
    CREATE = 'documents',
    UPDATE = 'documents',
    DELETE = 'documents',
    UPLOAD = 'documents'
}

export namespace DocumentActionEnum {
  export function toUrl(action: DocumentActionEnum, param?: any, isBaseUrlDossier?: boolean): string {
    var baseUrl = Constants.baseUrl;
    if (isBaseUrlDossier) {
      baseUrl = DossierActionEnum.toUrl(DossierActionEnum.GET, param);
      return `${baseUrl}/${action}`;
    }
    if (param !== undefined) {
      return `${baseUrl}/${action}/${param}`;
    }
    return `${baseUrl}/${action}`;
  }
}