# Pipes and Validators

## Preparation

<details><summary>auth-service.ts</summary>

```typescript
import { Injectable } from "@angular/core";
import { Observable, timer, of, BehaviorSubject } from "rxjs";
import { LoginData, User } from "../model";
import { map, tap, take } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  user: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  constructor() {}

  login(loginData: LoginData): Observable<User | null> {
    if (loginData) {
      return timer(30).pipe(
        map(time => {
          if (loginData.email === "simon.potzernheim@metafinanz.de") {
            return {
              id: "1",
              name: "simon.potzernheim@metafinanz.de",
              role: loginData.role
            } as User;
          }
          if (loginData.email.includes("@gmail.com")) {
            return { id: "2", name: loginData.email, role: "user" } as User;
          }
          return null;
        }),
        tap((loginAsUser: User) => this.user.next(loginAsUser))
      );
    }
    return of(null);
  }

  getUser() {
    return this.user.asObservable();
  }

  emailExists(email: string): Promise<boolean> {
    return timer(300)
      .pipe(
        map(time => {
          if (
            email === "simon.potzernheim@metafinanz.de" ||
            email.includes("@gmail.com")
          ) {
            return true;
          } else {
            return false;
          }
        })
      )
      .toPromise();
  }

  emailExistsRxjs(email: string): Observable<boolean> {
    return timer(300).pipe(
      map(time => {
        if (
          email === "simon.potzernheim@metafinanz.de" ||
          email.includes("@gmail.com")
        ) {
          return true;
        } else {
          return false;
        }
      }),
      take(1)
    );
  }
}
```

</details>

## Exersice 10.1 Create admin and email domain validator

## Exersice 10.2 Create user exists async validator

<details><summary>Solution</summary>

- login-dialog.compoonent.html

```html
<h2>Please Loging as {{state.role}}</h2>
<form (ngSubmit)="dialogRef.close(state)" #loginForm="ngForm" coolSpecialAdminValidator>
  <mat-form-field>
    <mat-select placeholder="Role" #roleInput [(value)]="state.role" matInput name="role" [(ngModel)]="state.role">
      <mat-option *ngFor="let role of roles" [value]="role">
        {{role}}
      </mat-option>
    </mat-select>
  </mat-form-field>
  <mat-error *ngIf="!!loginForm.errors?.specialAdmin &&  (loginForm.touched || loginForm.dirty)">
    Email address domain for admins are restricted.
  </mat-error>

  <mat-form-field>
    <input email coolUserExists required name="email" [(ngModel)]=state.email matInput placeholder="Email" #email="ngModel"
      [ngModelOptions]="{updateOn: 'blur'}">
    <mat-error> {{ data.message }} </mat-error>
    <mat-error *ngIf="email?.errors?.userExists">
      user does not exists
    </mat-error>
    <mat-error *ngIf="email?.errors?.email">
      Please enter a valid email address
    </mat-error>
    <mat-error *ngIf="email?.errors?.required">
      Email is <strong>required</strong>
    </mat-error>
  </mat-form-field>


  <button [disabled]="!loginForm.valid" mat-button color="primary">
    Login
  </button>
  <!-- {{loginForm.valid}}
  {{loginForm.touched}}
  {{loginForm.dirty}}
  {{loginForm.pristine}}
  {{loginForm.errors | json }}
  X:{{email.errors | json }} -->
</form>
```

- admin-email-validator.directive.ts

```typescript
import { Directive } from "@angular/core";
import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  FormGroup,
  Validator,
  NG_VALIDATORS
} from "@angular/forms";

export const adminDomainValidator: ValidatorFn = (
  control: FormGroup
): ValidationErrors | null => {
  const role = control.get("role");
  const email = control.get("email");

  return role &&
    email &&
    role.value === "admin" &&
    !email.value.includes("@metafinanz.de")
    ? { specialAdmin: true }
    : null;
};

@Directive({
  selector: "[coolSpecialAdminValidator]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: SpecialAdminValidatorDirective,
      multi: true
    }
  ]
})
export class SpecialAdminValidatorDirective implements Validator {
  constructor() {}

  validate(control: AbstractControl): ValidationErrors | null {
    return adminDomainValidator(control);
  }
}
```

- user-exists-validator.directive.ts

```typescript
import { Directive } from "@angular/core";
import {
  AsyncValidator,
  ValidationErrors,
  AbstractControl,
  NG_ASYNC_VALIDATORS
} from "@angular/forms";
import { Observable } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { AuthService } from "src/app/core";

@Directive({
  selector: "[coolUserExists]",
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: UserExistsDirective,
      multi: true
    }
  ]
})
export class UserExistsDirective implements AsyncValidator {
  constructor(private service: AuthService) {}

  validate(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    console.log("UserExistsDirective", ctrl);
    return this.service.emailExistsRxjs(ctrl.value).pipe(
      map(isTaken => (isTaken ? null : { userExists: true })),
      catchError(() => null)
    );
  }
}
```

</details>

## TODO Pipes
