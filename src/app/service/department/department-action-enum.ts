import { Constants } from "../../constants";

export enum DepartmentActionEnum {
    GET = 'departments/'
}

export namespace DepartmentActionEnum {
  export function toUrl(action: DepartmentActionEnum): string {
    return `${Constants.baseUrl}/${action}`;
  }
}