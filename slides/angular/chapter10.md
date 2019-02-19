# Chapter 10 Pipes and Validators

## Chapter 10.1 Ceate a simple register form with one input for email address

```bash
ng g component views/home/components/registerForm --changeDetection OnPush
```

<details><summary>register-form.component.html</summary>

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

## Exercise: 10.2

### Create admin and email domain validator

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

## Exercise 10.3 Create user exists async validator

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

## Exercise 10.4

### Create a custom pipe which transform the file upload size to KB or MB

- the custom pile should be used like this:

```typescript
{{ 12490 | fileSize }}
{{ 12490 | fileSize:'MB' }}
{{ 12490 | fileSize:'KB' }}
```

```bash
ng g pipe shared/directives/fileSize --export --lintFix

ng g service core/services/file
```

<details><summary>core/services/file.service.ts</summary>

```typescript
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class FileService {
  file = null;

  constructor() {}

  uploadFile(file: string | ArrayBuffer): string {
    this.file = file;
    return "c1b16842-826a-40b0-a2d9-dc9359fb9582";
  }
}
```

</details>
<details><summary>safe-item-form.component.ts</summary>

```typescript
import {
  Component,
  EventEmitter,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output
} from "@angular/core";
import { SafeItem } from "src/app/core";
import { FileService } from "src/app/core/services/file.service";

@Component({
  selector: "cool-safe-item-form",
  templateUrl: "./safe-item-form.component.html",
  styleUrls: ["./safe-item-form.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SafeItemFormComponent implements OnInit {
  constructor(private fileService: FileService) {}

  // TODO: Remove this when we're done
  get diagnostic() {
    return JSON.stringify(this.model);
  }

  @Output()
  result: EventEmitter<SafeItem> = new EventEmitter();
  model = <SafeItem>{};

  state = {
    file: null,
    fileSize: 0,
    uploading: false,
    invoice: null
  };

  ngOnInit() {}

  onSubmit() {
    this.result.emit(this.model);
  }

  onFileChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      this.state.file = event.target.files[0];
      this.state.fileSize = this.state.file.size;
      // console.log(this.state.file);
      reader.readAsDataURL(this.state.file);
      reader.onload = () => {
        // console.log(reader.result);
        const id = this.fileService.uploadFile(reader.result);
        this.model.invoiceId = id;
        // console.log(id);
      };
    }
  }
}
```

</details>
<details><summary>safe-item-form.component.html</summary>

```html
<h1>Please insert name and price of the item</h1>
<form (ngSubmit)="onSubmit()" #safeitemForm="ngForm">
  <div>
    <mat-form-field>
      <input autocomplete="section-item name" #name="ngModel" matInput placeholder="name" required aria-required="true"
        [(ngModel)]="model.name" type="text" name="name" class="form-control" id="name">
      <mat-error *ngIf="(name.invalid || !name.pristine) && name.getError('required')">required</mat-error>
    </mat-form-field>
    <mat-form-field>
      <input autocomplete="section-item price" #price="ngModel" matInput required placeholder="price" pattern="[0-9]*"
        aria-required="true" [(ngModel)]="model.price" type="text" name="price" class="form-control" id="price">
      <span matPrefix>€&nbsp;</span>
      <span matSuffix>.00</span>
      <mat-error *ngIf="(price.invalid || !price.pristine) && price.getError('required')">required</mat-error>
      <mat-error *ngIf="price.invalid || !price.pristine ">{{price.getError('pattern') | json}}</mat-error>
    </mat-form-field>
    <input autocomplete="off" #price="ngModel" required aria-required="true" (ngModel)="state.invoice" type="file"
      name="invoice" class="form-control" id="invoice" (change)="onFileChange($event)"> {{ state.fileSize |
    fileSize}}
    <button [disabled]="!safeitemForm.form.valid" mat-raised-button color="primary" type="submit">Submit</button>
  </div>
  {{ model | json }}
</form>
```

</details>

### Adjust the file size pipe

### Add a button to the item-list.component which will be used to show the invoice

<details><summary>solution</summary>

file-size.pipe.ts

```typescript
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "fileSize"
})
export class FileSizePipe implements PipeTransform {
  transform(value: number, args?: any): any {
    console.log("filesize", value, args);
    if (args) {
      switch (args) {
        case "KB": {
          return value / 1024;
        }
        case "MB": {
          return value / (1024 * 1024);
        }
      }
    } else {
      let currentValue = value;
      let counter = 0;
      while (currentValue > 1024) {
        currentValue = currentValue / 1024;
        counter++;
      }
      return `${currentValue} ${getUnit(counter)}`;
    }
    return value;
  }
}

function getUnit(val) {
  switch (val) {
    case 0:
      return "B";
    case 1:
      return "KB";
    case 2:
      return "MB";
    case 3:
      return "WTF";
  }
}
```

item-list.component.html

```html
 <button *ngIf="item.invoiceId" (click)="showInvoiceEmitter.emit(item.invoiceId)" mat-button>Show Invoice</button>
```

item-list.component.ts

```typescript
@Output()
showInvoiceEmitter = new EventEmitter<string>();
```

</details>

[Next](chapter11.md)
