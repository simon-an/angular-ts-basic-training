import { TestBed } from '@angular/core/testing';

import { SafeResolverService } from './safe-resolver.service';

describe('SafeResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SafeResolverService = TestBed.get(SafeResolverService);
    expect(service).toBeTruthy();
  });
});
