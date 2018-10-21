/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { UserExistsDirective } from './user-exists-validator.directive';
import { AuthService } from 'src/app/core';

describe('Directive: UserExists', () => {
  it('should create an instance', () => {
    const directive = new UserExistsDirective(new AuthService());
    expect(directive).toBeTruthy();
  });
});
