import { Constants } from "../../constants";

export enum ChatActionEnum {
    POST_SESSION = 'chat-sessions',
    POST_MESSAGE = 'chat-sessions/{id}/messages'
}

export namespace ChatActionEnum {
  export function toUrl(action: ChatActionEnum, param?: any): string {
    let url = action.toString();
    
    if (url.includes('{id}') && param !== undefined) {
      url = url.replace('{id}', param.toString());
    }
    
    return `${Constants.baseUrl}/${url}`;
  }
}