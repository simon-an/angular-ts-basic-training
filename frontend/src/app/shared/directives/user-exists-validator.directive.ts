import { Directive } from '@angular/core';
import { AsyncValidator, ValidationErrors, AbstractControl, NG_ASYNC_VALIDATORS } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/core';

@Directive({
  selector: '[coolUserExists]',
  providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting: UserExistsDirective, multi: true }]
})
export class UserExistsDirective implements AsyncValidator {
  constructor(private service: AuthService) {}

  validate(ctrl: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    console.log('UserExistsDirective', ctrl);
    return this.service.emailExistsRxjs(ctrl.value).pipe(
      map(isTaken => (isTaken ? null : { userExists: true })),
      catchError(() => null)
    );
  }
}
