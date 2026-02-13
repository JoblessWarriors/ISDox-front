import { TestBed } from '@angular/core/testing';

import { FlagIconService } from './flag-icon';

describe('FlagIcon', () => {
  let service: FlagIconService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlagIconService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
