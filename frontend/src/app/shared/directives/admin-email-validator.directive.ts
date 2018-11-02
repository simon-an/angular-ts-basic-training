import { Directive } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup, Validator, NG_VALIDATORS } from '@angular/forms';

export const adminDomainValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const role = control.get('role');
  const email = control.get('email');

  return role && email && role.value === 'admin' && email.value && !email.value.includes('@metafinanz.de')
    ? { specialAdmin: true }
    : null;
};

@Directive({
  selector: '[coolSpecialAdminValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: SpecialAdminValidatorDirective, multi: true }]
})
export class SpecialAdminValidatorDirective implements Validator {
  constructor() {}

  validate(control: AbstractControl): ValidationErrors | null {
    return adminDomainValidator(control);
  }
}
