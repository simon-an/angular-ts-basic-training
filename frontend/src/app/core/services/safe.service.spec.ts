import { TestBed } from '@angular/core/testing';

import { SafeService } from './safe.service';

describe('SafeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SafeService = TestBed.get(SafeService);
    expect(service).toBeTruthy();
  });
});
