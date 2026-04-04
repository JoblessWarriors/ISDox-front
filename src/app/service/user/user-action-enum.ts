import { Constants } from "../../constants";

export enum UserActionEnum {
  GET = 'users',
  CREATE = 'users',
  UPDATE = 'users',
  DELETE = 'users',
  CHANGE_PASSWORD = 'users/{id}/password',
  CHANGE_AVATAR = 'users/{id}/avatar'
}

export namespace UserActionEnum {
  export function toUrl(action: UserActionEnum, param?: any): string {
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