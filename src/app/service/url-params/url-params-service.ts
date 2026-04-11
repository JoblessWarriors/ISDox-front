import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UrlParamsService {
  static buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();

    Object.keys(params).forEach((key) => {
      const value = params[key];

      if (value === null || value === undefined || value === '') return;
      
      searchParams.append(key, value.toString());
      
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
  }
}
