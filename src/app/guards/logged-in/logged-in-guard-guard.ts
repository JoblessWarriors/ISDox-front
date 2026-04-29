import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../service/auth/auth-service';
import { RouteTranslationService } from '../../service/route-translation/route-translation-service';
import { Constants } from '../../constants';

export const loggedInGuardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const routeTranslationService = inject(RouteTranslationService);
  if (authService.isLoggedIn()) {
    return true;
  }
  const urls = routeTranslationService.getUrlsForLanguage();
  router.navigateByUrl(urls.get(Constants.defaultPage));
  return false;
};
