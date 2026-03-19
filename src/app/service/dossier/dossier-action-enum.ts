import { Constants } from "../../constants";

export enum DossierActionEnum {
  GET = 'dossiers',
  POST = 'dossiers',
  PUT = 'dossiers',
  DELETE = 'dossiers'
}

export namespace DossierActionEnum {
  export function toUrl(action: DossierActionEnum, param?: any): string {
    if (param !== undefined) {
      return `${Constants.baseUrl}/${action}/${param}`;
    }
    return `${Constants.baseUrl}/${action}`;
  }
}