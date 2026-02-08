import { TestBed } from '@angular/core/testing';

import { RouteTranslationService } from './route-translation-service';

describe('RouteTranslationService', () => {
  let service: RouteTranslationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouteTranslationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
