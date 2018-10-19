/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BadServiceService } from './bad-service.service';

describe('Service: BadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BadServiceService]
    });
  });

  it('should ...', inject([BadServiceService], (service: BadServiceService) => {
    expect(service).toBeTruthy();
  }));
});
