/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { UserExistsDirective } from './user-exists-validator.directive';
import { AuthService } from 'app/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('Directive: UserExists', () => {
  let httpMock: HttpTestingController;
  let authservice: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: []
    });

    authservice = TestBed.get(AuthService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should create an instance', () => {
    const directive = new UserExistsDirective(authservice);
    expect(directive).toBeTruthy();
  });
});
