import { TestBed } from '@angular/core/testing';

import { AdminSafesResolverService } from './admin-safes-resolver.service';

describe('AdminSafesResolverServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminSafesResolverService = TestBed.get(AdminSafesResolverService);
    expect(service).toBeTruthy();
  });
});
