import { Constants } from "../../constants";

export enum DepartmentActionEnum {
    GET = 'departments',
    CREATE = 'departments',
    UPDATE = 'departments',
    DELETE = 'departments'
}

export namespace DepartmentActionEnum {
  export function toUrl(action: DepartmentActionEnum, param?: any): string {
    if (param !== undefined) {
      return `${Constants.baseUrl}/${action}/${param}`;
    }
    return `${Constants.baseUrl}/${action}`;
  }
}