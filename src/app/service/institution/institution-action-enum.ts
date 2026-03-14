import { Constants } from "../../constants";

export enum InstitutionActionEnum {
  GET = 'institutions',
  CREATE = 'institutions',
  UPDATE = 'institutions',
  DELETE = 'institutions'
}

export namespace InstitutionActionEnum {
  export function toUrl(action: InstitutionActionEnum, param?: any): string {
    if (param !== undefined) {
      return `${Constants.baseUrl}/${action}/${param}`;
    }
    return `${Constants.baseUrl}/${action}`;
  }
}