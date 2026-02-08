import { TestBed } from '@angular/core/testing';

import { ThemePreferenceService } from './theme-preference-service';

describe('ThemePreferenceService', () => {
  let service: ThemePreferenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemePreferenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
