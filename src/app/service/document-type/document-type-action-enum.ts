import { Constants } from "../../constants";

export enum DocumentTypeActionEnum {
    GET = 'document-types',
}

export namespace DocumentTypeActionEnum {
  export function toUrl(action: DocumentTypeActionEnum, param?: any): string {
    if (param !== undefined) {
      return `${Constants.baseUrl}/${action}/${param}`;
    }
    return `${Constants.baseUrl}/${action}`;
  }
}