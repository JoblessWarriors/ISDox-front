import { Constants } from "../../constants";

export enum UserActionEnum {
  GET = 'users',
  CREATE = 'users',
  UPDATE = 'users',
  DELETE = 'users'
}

export namespace UserActionEnum {
  export function toUrl(action: UserActionEnum, param?: any): string {
    if (param !== undefined) {
      return `${Constants.baseUrl}/${action}/${param}`;
    }
    return `${Constants.baseUrl}/${action}`;
  }
}