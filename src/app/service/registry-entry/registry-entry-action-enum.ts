import { Constants } from "../../constants";

export enum RegistryEntryActionEnum {
    CREATE = 'registry-entries',
}

export namespace RegistryEntryActionEnum {
  export function toUrl(action: RegistryEntryActionEnum, param?: any): string {
    if (param !== undefined) {
      return `${Constants.baseUrl}/${action}/${param}`;
    }
    return `${Constants.baseUrl}/${action}`;
  }
}