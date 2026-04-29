import { TestBed } from '@angular/core/testing';

import { RegistryEntryService } from './registry-entry-service';

describe('RegistryEntryService', () => {
  let service: RegistryEntryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistryEntryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
