import { Constants } from "../../constants";

export enum AuthActionEnum {
    LOGIN = 'tokens',
    LOGOUT = 'logout'
}

export namespace AuthActionEnum {
  export function toUrl(action: AuthActionEnum): string {
    return `${Constants.baseUrl}/${action}`;
  }
}