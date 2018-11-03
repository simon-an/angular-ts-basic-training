import { RouterTestingModule } from '@angular/router/testing';
import { SafeService } from './safe.service';
import { TestBed } from '@angular/core/testing';

import { SafeResolverService } from './safe-resolver.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SafeResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: []
    });
  });

  it('should be created', () => {
    const service: SafeResolverService = TestBed.get(SafeResolverService);
    expect(service).toBeTruthy();
  });
});
