# Chapter 10 Pipes and Validators

## Preparation: Ceate a simple register form with one input for email address

```bash
ng g component views/home/components/registerForm --changeDetection OnPush
```

<details><summary>Code</summary>

- register-form.component.html

```html
<form (ngSubmit)="onSubmit()" #registerForm="ngForm">
  <mat-form-field>
    <mat-select placeholder="Role" #roleInput [(value)]="state.role" matInput name="role" [(ngModel)]="state.role">
      <mat-option *ngFor="let role of roles" [value]="role">
        {{ role }}
      </mat-option>
    </mat-select>
  </mat-form-field>
  <mat-error *ngIf="!!registerForm.errors?.AdminEmail && (email.touched || email.dirty)">
    Email address domain for admins are restricted.
  </mat-error>

  <mat-form-field>
    <input
      email
      required
      name="email"
      [(ngModel)]="state.email"
      matInput
      placeholder="Email"
      #email="ngModel"
      autocomplete="section-register email"
      [ngModelOptions]="{ updateOn: 'blur' }"
    />
    <mat-error *ngIf="email?.errors?.userExists">
      user does not exists
    </mat-error>
    <mat-error *ngIf="email?.errors?.email">
      Please enter a valid email address
    </mat-error>
    <mat-error *ngIf="email?.errors?.required"> Email is <strong>required</strong> </mat-error>
  </mat-form-field>

  <button [disabled]="!registerForm.valid" mat-button color="primary">
    Register
  </button>
</form>
```
- register-form.component.ts

```typescript
import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: "cool-register-form",
  templateUrl: "./register-form.component.html",
  styleUrls: ["./register-form.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterFormComponent implements OnInit {
  model = { email: "" };

  constructor() {}

  ngOnInit() {}

  onSubmit() {
    console.log("Register user with email: ", this.model.email);
  }
}
```

- home-module.ts

```typescript

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { LayoutModule } from '~layout/layout.module';
import { SafeModule } from '~safe/safe.module';
import { HomeLandingPageComponent } from './home-landing-page/home-landing-page.component';
import { MatListModule, MatFormFieldModule, MatInputModule, MatSelectModule } from '@angular/material';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [HomeLandingPageComponent, RegisterFormComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    LayoutModule,
    MatListModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
})
export class HomeModule {}


```

</details>

- Add a mock function to auth.service.ts which checks wheather email address exists in backend.

<details><summary>emailExists</summary>

```typescript
  emailExists(email: string): Promise<boolean> {
    return timer(300)
      .pipe(
        map(time => {
          if (
            Math.random()*100 < 20
          ) {
            return true;
          } else {
            return false;
          }
        })
      )
      .toPromise();
  }
```

</details>

## Exercise 10.1 Create admin and email domain validator

- Create a validator (admin-email-validator.directive.ts), which validates the email to be from a specific domain, when the role is admin.
- Hint: Validator must be attached to the form tag.
- Hint: you need to get both, the role and the email value from the form.
- Hint: You need to implement the Validator interface.
- Hint: You need to add the Directive as a Provider to NG_VALIDATORS.

```bash
ng generate directive views/home/directives/admin-email-validator SpecialAdminValidatorDirective --module home
```

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

@Directive({
  selector: "[coolAdminEmailValidator]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: AdminEmailValidatorDirective,
      multi: true
    }
  ]
})
export class AdminEmailValidatorDirective implements Validator {
  constructor() {}
  validate(control: AbstractControl): ValidationErrors | null {
    return adminDomainValidator(control);
  }
}

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
```

```html
<form (ngSubmit)="onSubmit()" #registerForm="ngForm" coolAdminEmailValidator>
  <mat-error *ngIf="!!registerForm.errors?.AdminEmail">
    Email address domain for admins are restricted to domains: {{ registerForm?.errors?.AdminEmail?.domains }}
  </mat-error>
```

</details>

## Exercise 10.2 Create user exists async validator

- Create an async validator, which calles the auth-service userExists method.
- Attach the validator to the email input field.
- Directive must implement AsyncValidator interface.
- Directive must be a provider to NG_ASYNC_VALIDATORS.

<details><summary>Solution</summary>

Create user-exists-validator.directive.ts

```bash
ng generate directive views/home/directives/user-exists-validator UserExistsValidatorDirective --module home
```

```typescript
import { Directive } from "@angular/core";
import {
  AsyncValidator,
  ValidationErrors,
  AbstractControl,
  NG_ASYNC_VALIDATORS
} from "@angular/forms";
import { Observable, from } from "rxjs";
import { map, catchError, take } from "rxjs/operators";
import { AuthService } from "~core/services/auth.service";

@Directive({
  selector: "[coolUserExistsValidator]",
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: UserExistsValidatorDirective,
      multi: true
    }
  ]
})
export class UserExistsValidatorDirective implements AsyncValidator {
  constructor(private service: AuthService) {}

  validate(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    console.log("UserExistsDirective", ctrl);
    return from(this.service.emailExists(ctrl.value)).pipe(
      map(isTaken => (isTaken ? { userExists: "user already exists" } : null)),
      catchError(() => null)
    );
  }
}
```

</details>

## Exercise 10.3 Material Elevation: [Docs](https://material.io/design/environment/elevation.html)

- add body css class to home-landing-page.component

```html
  <div body class="body">
    <h2>Welcome to the Cool Safe App.</h2>
    <p>Please login or register as a new user.</p>
    <cool-register-form></cool-register-form>
  </div>
```

- use mixins to add material elevation to the body class. [Material Docs](https://material.angular.io/guide/elevation)

<details><summary>home-landing-page.component.scss</summary>

```scss
@import "~@angular/material/theming";
.body {
  // Adds a shadow for elevation level 2 with default color and full opacity:
  @include mat-elevation(2);
  padding: 20px;
  margin: 10px;
}
```

</details>

[Next](chapter11.md)
