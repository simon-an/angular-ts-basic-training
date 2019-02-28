# Chapter 9

## Preparation

### Create LoginData model

```typescript
export interface LoginData {
  email: string;
  role: string;
}
```

### Create User model

- user.ts
- administrator.ts
- customer.ts

```typescript
export interface Customer {
  id: string;
  name: string;
  role: "Customer";
  safeId: string;
}
export interface Administrator {
  id: string;
  name: string;
  role: "Administrator";
}

import { Administrator } from "~core/model/admin";
import { Customer } from "./customer";

export type User = Administrator | Customer;

export const UserTypeGuard = {
  Customer: (user: User): user is Customer => {
    return user.role === "Customer";
  },
  Administrator: (user: User): user is Administrator => {
    return user.role === "Administrator";
  }
};
```

Add both models to the barrel file.

### Create auth service

```bash
ng g service core/services/auth
```

```typescript
import { UserTypeGuard } from "./../model/user";
import { filter, map, tap } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, timer, of } from "rxjs";
import { Customer } from "~core/model/customer";
import { User } from "~core/model/user";
import { Administrator } from "~core/model/admin";
import { LoginData } from "~core/model/login-data";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  currentUser$$: BehaviorSubject<User> = new BehaviorSubject(null);
  currentUser$: Observable<User>;

  constructor() {
    this.currentUser$ = this.currentUser$$.asObservable();
  }

  getCurrentUser(): Observable<User> {
    return this.currentUser$;
  }

  getCurrentCustomer(): Observable<Customer> {
    return this.currentUser$.pipe(
      filter(Boolean),
      map(user => {
        if (UserTypeGuard.Customer(user)) {
          return user;
        }
        return null;
      }),
      filter(Boolean)
    );
  }

  getCurrentAdministrator(): Observable<Administrator> {
    return this.currentUser$.pipe(
      filter(Boolean),
      map(user => {
        if (UserTypeGuard.Administrator(user)) {
          return user;
        }
        return null;
      }),
      filter(Boolean)
    );
  }

  login(loginData: LoginData): Observable<User | null> {
    if (loginData) {
      return timer(30).pipe(
        map(time => {
          return {
            id: "1",
            name: "test@coolsafe.de",
            role: loginData.role
          } as User;
        }),
        tap((loginAsUser: User) => this.currentUser$$.next(loginAsUser))
      );
    }
    return of(null);
  }

  logout() {
    this.currentUser$$.next(null);
  }
}
```

### Create auth guard and admin guard

```cli
ng g guard core/guards/auth --lintFix
ng g guard core/guards/admin --lintFix
```

## Exercise 9.1

### Implement Guards

When guard blocks, it should schedule a redirect.

<details>
<summary>Solution</summary>

### Add guards to app-routing.module.ts

```typescript
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { AuthGuard } from "~core/guards/auth.guard";
import { AdminGuard } from "~core/guards/admin.guard";

const routes: Routes = [
  {
    path: "admin",
    loadChildren: "./views/admin/admin.module#AdminModule",
    canLoad: [AuthGuard, AdminGuard],
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: "user",
    loadChildren: "./views/user/user.module#UserModule",
    canLoad: [AuthGuard],
    canActivate: [AuthGuard]
  },
  {
    path: "home",
    loadChildren: "./views/home/home.module#HomeModule"
  },
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full"
  },
  { path: "**", component: PageNotFoundComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
```

### admin.guard.ts

```typescript
import { Injectable } from "@angular/core";
import {
  CanActivate,
  CanLoad,
  Route,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from "@angular/router";
import { Observable } from "rxjs";
import { map, tap, take } from "rxjs/operators";
import { AuthService } from "~core/services/auth.service";

@Injectable({
  providedIn: "root"
})
export class AdminGuard implements CanActivate, CanLoad {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.userIsAdmin();
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.userIsAdmin();
  }
  userIsAdmin(): Observable<boolean> {
    return this.auth.getCurrentUser().pipe(
      map(user => user.role === "Administrator"),
      tap(canload => {
        if (!canload) {
          console.log("error. goback to home.");
          this.router.navigate(["/home"]);
        }
      }),
      take(1)
    );
  }
}
```

### auth.guard.ts

```typescript
import { Injectable } from "@angular/core";
import {
  CanActivate,
  CanLoad,
  Route,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "~core/services/auth.service";
import { map, tap, take } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.verifyUser();
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.verifyUser();
  }

  verifyUser(): Observable<boolean> {
    return this.auth.getCurrentUser().pipe(
      map(Boolean),
      tap(canload => {
        if (!canload) {
          console.log("error. goback to home.");
          this.router.navigate(["/home"]);
        }
      }),
      take(1)
    );
  }
}
```

</details>

### Add auth.service login call to home-landing-page.component

```typescript
import { Customer, LoginData } from "~core/model";
import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { AuthService } from "~core/services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "cool-home-landing-page",
  templateUrl: "./home-landing-page.component.html",
  styleUrls: ["./home-landing-page.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeLandingPageComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  login(loginAsRole: "Administrator" | "Customer") {
    this.authService
      .login({ role: loginAsRole, email: "nomail@gmail.com" } as LoginData)
      .subscribe(user => {
        if (user.role === "Customer") {
          this.router.navigate(["/user"]);
        }
        if (user.role === "Administrator") {
          this.router.navigate(["admin"]);
        }
      });
  }
}
```

## Additional Exercise 9.4.1

### Create safe-resolver.service.ts for safe component routing

```bash
ng g service core/services/SafeResolver
```

<details><summary>Solution</summary>

safe-resolver.service.ts

```typescript
import { Injectable } from "@angular/core";
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from "@angular/router";
import { Observable, of, EMPTY } from "rxjs";
import { mergeMap, take } from "rxjs/operators";

import { Safe } from "../model";
import { SafeService } from "./safe.service";

@Injectable({
  providedIn: "root"
})
export class SafeResolverService implements Resolve<Safe> {
  constructor(private safeService: SafeService, private router: Router) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Safe> | Observable<never> {
    const id = route.paramMap.get("id");

    return this.safeService.getSafe(id).pipe(
      take(1),
      mergeMap(safe => {
        if (safe) {
          return of(safe);
        } else {
          // id not found
          this.router.navigate(["home"]);
          return EMPTY;
        }
      })
    );
  }
}
```

safe.component.ts

```typescript
this.safe$ = this.activatedRoute.data.pipe(
  map((data: { safe: Safe }) => {
    return data.safe;
  })
);
```

Question: Is safe.component now dumb?

</details>

## Additional Excercise: Create Login Dialog 9.4.2

### Create Login Dialog Component and Login Component

```bash
ng g component --export shared/containers/login
```

<details>
<summary>login.component.html</summary>

```html
<button mat-button color="primary" (click)="openModal()">Login</button>
```

</details>

### Create Login Component with routing

Hint: create a route <code>/login/:role</code> to LoginComponent in the home module

<details>
<summary>Solution</summary>

home-routing.module.ts

```typescript
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "src/app/shared/container/login/login.component";

const routes: Routes = [
  {
    path: "index",
    component: HomeComponent,
    children: [
      {
        path: "login/:role",
        component: LoginComponent
      }
    ]
  },
  {
    path: "",
    redirectTo: "index"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
```

home.component.html

```html
<cool-header-with-sidenav>
  <ng-container navlist>
    <mat-nav-list>
      <a mat-list-item routerLink="login/admin" routerLinkActive="active"
        >Login as Admin</a
      >
      <a mat-list-item routerLink="login/user" routerLinkActive="active"
        >Login as User</a
      >
    </mat-nav-list>
  </ng-container>
  <p body>
    <router-outlet></router-outlet>
  </p>
</cool-header-with-sidenav>
```

</details>

### Create Login Dialog

<details>
<summary>login-dialog.component.scss</summary>

```css
form {
  display: flex;
  flex-direction: column;
}
```

</details>

<details>
<summary>login-dialog.component.ts</summary>

```typescript
import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "cool-login-dialog",
  templateUrl: "./login-dialog.component.html",
  styleUrls: ["./login-dialog.component.scss"]
})
export class LoginDialogComponent {
  roles = ["user", "admin"];
  state = {
    role: "user",
    email: "simon@gmail.com"
  };

  constructor(
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    data.role.subscribe(role => (this.state.role = role));
  }
}
```

</details>
<details>
<summary>login-dialog.component.html</summary>

```html
<h2>Please Log in as {{state.role}}</h2>
<form (ngSubmit)="dialogRef.close(state)" #loginForm="ngForm">
  <mat-form-field>
    <mat-select placeholder="Role" #roleInput [(value)]="state.role">
      <mat-option *ngFor="let role of roles" [value]="role">
        {{role}}
      </mat-option>
    </mat-select>
  </mat-form-field>

  <mat-form-field>
    <input
      required
      name="email"
      [(ngModel)]="state.email"
      matInput
      placeholder="Email"
      #email="ngModel"
    />
    <mat-error> {{ data.message }} </mat-error>
  </mat-form-field>

  <button [disabled]="!email.valid" mat-button color="primary">
    Login
  </button>
</form>
```

</details>
<details>
<summary>login.component.ts</summary>

```typescript
import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { LoginDialogComponent } from "../login-dialog/login-dialog.component";
import { switchMap, map, tap } from "rxjs/operators";
import { AuthService } from "src/app/core/services/auth.service";
import { LoginData } from "src/app/core/model/logindata";
import { User } from "src/app/core/model/user";
import { of } from "rxjs";

@Component({
  selector: "cool-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  dialogRef: MatDialogRef<LoginDialogComponent>;

  config: MatDialogConfig = {
    disableClose: false,
    hasBackdrop: true,
    backdropClass: "",
    width: "",
    height: "",
    position: {
      top: "",
      bottom: "",
      left: "",
      right: ""
    },
    data: {
      message: "",
      role: of("user")
    }
  };

  loading = false;

  constructor(
    private auth: AuthService,
    public dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.config.data.role = this.activatedRoute.paramMap.pipe(
      map((params: ParamMap) => params.get("role"))
    );
    this.openModal();
  }

  ngOnInit() {}

  openModal() {
    this.dialogRef = this.dialog.open(LoginDialogComponent, this.config);
    this.dialogRef
      .afterClosed()
      .pipe(
        tap(() => (this.loading = true)),
        switchMap((loginData: LoginData) => {
          console.log("data", loginData);
          return this.auth.login(loginData);
        })
      )
      .subscribe((user: User | null) => {
        this.loading = false;
        console.log("user", user);
        this.dialogRef = null;
        if (user) {
          if (user.role) {
            this.router.navigate(["/" + user.role]);
          } else {
            this.router.navigate(["/user"]);
          }
        } else {
          this.config.data.message = "Unauthorized";
          this.openModal();
        }
      });
  }
}
```

</details>

### Add progress spinner to login.component

Hint: Use mat-spinner from Angular Material.

<details>
<summary>Solution</summary>

login.component.html

```html
<button
  *ngIf="!loading; else spinner"
  mat-button
  color="primary"
  (click)="openModal()"
>
  Login
</button>
<ng-template #spinner>
  <mat-spinner></mat-spinner>
</ng-template>
```

</details>

## Additional Exercise 9.4.3

### Inject role to Dialog Component

```typescript
export const ROLE_TOKEN = new InjectionToken<Observable<string>>("ROLE");

export const roleFactory = (activatedRoute: ActivatedRoute) => {
  return activatedRoute.paramMap.pipe(
    map((params: ParamMap) => params.get("role"))
  );
};

export const roleProvider = {
  provide: ROLE_TOKEN,
  useFactory: roleFactory,
  deps: [ActivatedRoute]
};
```

[Next](chapter10.md)
