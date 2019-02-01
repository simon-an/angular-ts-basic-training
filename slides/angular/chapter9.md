# Chapter 9

## Preparation

### Create auth service:

```bash
ng g service core/services/auth
```

```typescript
import { Injectable } from "@angular/core";
import { Observable, timer, of, BehaviorSubject } from "rxjs";
import { LoginData, User } from "../model";
import { map, tap } from "rxjs/operators";

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
}
```

### Create auth guard and admin guard:

```cli
ng g guard core/guards/auth --lintFix
ng g guard core/guards/admin --lintFix
```

### Create Login Dialog Component and Login Component

```bash
ng g component --entry-component --export shared/containers/loginDialog
ng g component --export shared/containers/login
```

<details>
<summary>login.component.html</summary>

```html
<button mat-button color="primary" (click)="openModal()">Login</button>
```

</details>

### Create LoginData model

```typescript
export interface LoginData {
  email: string;
  role: string;
}
```

### Create User model

```typescript
export interface User {
  id: string;
  name: string;
  role: string;
}
```

Add both models to the barrel file.

## Exercise: 9.1

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
      <a mat-list-item routerLink="login/admin" routerLinkActive="active">Login as Admin</a>
      <a mat-list-item routerLink="login/user" routerLinkActive="active">Login as User</a>
    </mat-nav-list>
  </ng-container>
  <p body>
    <router-outlet></router-outlet>
  </p>
</cool-header-with-sidenav>
```

</details>

## Exercise: 9.2

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
    <input required name="email" [(ngModel)]="state.email" matInput placeholder="Email" #email="ngModel">
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

## Exercise: 9.2.1

### Add progress spinner to login.component

Hint: Use mat-spinner from Angular Material.

<details>
<summary>Solution</summary>

login.component.html

```html
<button *ngIf="!loading; else spinner" mat-button color="primary" (click)="openModal()">Login</button>
<ng-template #spinner>
  <mat-spinner></mat-spinner>
</ng-template>
```

</details>

## Exercise: 9.3

### Implement Guards

When guard blocks, it should schedule a redirect.

<details>
<summary>Solution</summary>

### Add guards to app-routing.module.ts

```typescript
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AdminGuard } from "./core/guards/admin.guard";
import { AuthGuard } from "./core/guards/auth.guard";

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
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes
      // { enableTracing: true } // <-- debugging purposes only
    )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
```

### admin.guard.ts

```typescript
import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanLoad,
  Router,
  Route
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import { map, tap, take } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class AdminGuard implements CanActivate, CanLoad {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.userIsAdmin();
  }

  canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    return this.userIsAdmin();
  }

  userIsAdmin(): Observable<boolean> {
    return this.auth.getUser().pipe(
      map(user => user.role === "admin"),
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
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanLoad,
  Route
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import { map, tap, take } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.verifyUser();
  }

  canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    return this.verifyUser();
  }

  verifyUser(): Observable<boolean> {
    return this.auth.getUser().pipe(
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

## Additional Exercise: 9.4.1

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

## Additional Exercise: 9.4.2

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
