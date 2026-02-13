import { Injectable } from '@angular/core';
import { LanguageEnum } from '../../enums/language-enum';

@Injectable({
  providedIn: 'root',
})
export class FlagIconService {
  public getFlagByLanguage(lang: LanguageEnum) {
    switch (lang) {
      case LanguageEnum.RO:
        return 'fi fi-ro';
      case LanguageEnum.EN_US:
        return 'fi fi-us';
      default:
        return null;
    }
  }
}
