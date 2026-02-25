import { HttpInterceptorFn, HttpParams } from '@angular/common/http';
import { Constants } from '../../constants';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let cookieService = inject(CookieService);
  var requestUrl = req.url;
  if (!req.url.startsWith('http')) {
    requestUrl = `${Constants.baseUrl}${req.url}`;
  }

  var newHeaders = req.headers;

  if (!req.headers.has('Content-Type') 
      && !(req.body instanceof HttpParams)
      && !(req.body instanceof FormData)) {
    newHeaders = newHeaders.set('Content-Type', 'application/json');
  }

  const token = cookieService.get('ISDox_access_token');
  const tokenType = cookieService.get('ISDox_token_type') || 'Bearer';

  if (token) {
    newHeaders = newHeaders.set('Authorization', `${tokenType} ${token}`);
  }
  
  const modifiedReq = req.clone({
    url: requestUrl,
    headers: newHeaders
  });

  return next(modifiedReq);
};
