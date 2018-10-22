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

## Exercise 10.3 Create a custom pipe which transform the file upload size to KB or MB

```cli
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
  styleUrls: ["./safe-item-form.component.css"],
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

- safeitem.ts

```typescript
export class SafeItem {
  id: string;
  name: string;
  price: number;
  invoiceId: string;
}
```

- create the file pipe.
- add a button to the item-list.component, which will be used to show the invoice.

<details><summary>solution</summary>

- file-size.pipe.ts

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

- item-list.component.html

```html
 <button *ngIf="item.invoiceId" (click)="showInvoiceEmitter.emit(item.invoiceId)" mat-button>Show Invoice</button>
```

- item-list.component.ts

```typescript
  @Output()
  showInvoiceEmitter = new EventEmitter<string>();
```

</details>
