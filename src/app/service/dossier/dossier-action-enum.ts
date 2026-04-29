import { Constants } from "../../constants";

export enum DossierActionEnum {
  GET = 'dossiers',
  POST = 'dossiers',
  PUT = 'dossiers',
  DELETE = 'dossiers',
  PATCH = 'dossiers/{id}/status',
  PATCH_BULK = 'dossiers/bulk/status',
  GET_PREVIEWS = 'dossiers/{id}/document-previews',
  GET_URLS = 'dossiers/{id}/document-urls'
}

export namespace DossierActionEnum {
  export function toUrl(action: DossierActionEnum, param?: any): string {
    let url = action.toString();
    
    if (url.includes('{id}') && param !== undefined) {
      url = url.replace('{id}', param.toString());
    }
    else if (param !== undefined) {
      url = `${url}/${param}`;
    }
    
    return `${Constants.baseUrl}/${url}`;
  }
}