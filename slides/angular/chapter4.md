# Chapter 4

## Preparation 4.1

### Generate all needed modules

```bash
# make sure you are in the angular project folder
cd ngx-safe

# Generate new shared module
ng generate module safe
ng generate module layout

# Generate home, user and admin modules
ng g module views/home --routing
ng g module views/user --routing
ng g module views/admin --routing
```

- import shared module in view modules.

### Generate root components for modules

```bash
# Generate home view
ng g c views/home/homeLandingPage --changeDetection OnPush --module views/home
```

```bash
# Generate admin view
ng g c views/admin/pages/adminLandingPage --changeDetection OnPush --module views/admin
```

```bash
# Generate user view
ng g c views/user/userLandingPage --changeDetection OnPush --module views/user
```

## Exercise: 4.2

Replace code in app/app.component.html

```html
<router-outlet></router-outlet>
```

Configure routing of the whole app in app/app-routing.module.ts

```TypeScript
const routes: Routes = [
  {
    path: 'admin',
    loadChildren: './views/admin/admin.module#AdminModule'
  },
  {
    path: 'user',
    loadChildren: './views/user/user.module#UserModule'
  },
  {
    path: 'home',
    loadChildren: './views/home/home.module#HomeModule'
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];
```

Add routing configuration to app/views/home/home-routing.module.ts

```TypeScript
const routes: Routes = [
  {
    path: '',
    component: HomeLandingPageComponent
  }
];
```

### Admin View

Add routing configuration to app/views/admin-routing.module.ts

<details><summary>Show Solution</summary>

```TypeScript
const routes: Routes = [
  {
    path: '',
    component: AdminLandingPageComponent
  }
];
```

</details>

### User View

Add routing configuration to app/views/user/user-routing.module.ts

<details><summary>Show Solution</summary>

```TypeScript
const routes: Routes = [
  {
    path: '',
    component: UserLandingPageComponent
  }
];
```

</details>

## Exercise: 4.3 Add navigation to the home component

### Add Angular Material and your first module

```bash
# Add Angular Material
ng add @angular/material
```

### Add content to src\app\shared\components\header-with-sidenav\header-with-sidenav.component.html

```bash
# Generate header with sidenav
ng g @angular/material:nav --name layout/header-with-sidenav --changeDetection OnPush --export --module layout --selector cool-header-with-sidenav
```

Replace mat-nav-list html tag with

```html
<ng-content select="[navlist]"></ng-content>
```

Replace "Add Content Here" comment

```html
<ng-content select="[body]"></ng-content>
```

### Home View

Add content to src\app\views\home\home-landing-page\home-landing-page.component.html

```html
<cool-header-with-sidenav>
  <ng-container navlist>
    <mat-nav-list>
      <a mat-list-item routerLink="/admin" routerLinkActive="active"
        >Login as Admin</a
      >
      <a mat-list-item routerLink="/user" routerLinkActive="active"
        >Login as User</a
      >
    </mat-nav-list>
  </ng-container>
  <p body>home works</p>
</cool-header-with-sidenav>
```

Add LayoutModule and MatListModule to home.module.ts

Now you can navigate to the user and the admin page.

Hint: When loading user page, you can see that only the user module is loaded in the Chrome networks tab.

## Fix Karma Tests: 4.4

- home-landing-page.component.spec.ts

```typescript
imports: [CommonModule, NoopAnimationsModule, MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule],
```

- app.component.spec.ts

Very easy to fix.

## Addional Exercise: 4.5 Secondary Routing

<details><summary>Task</summary>

```bash
ng g c views/user/containers/userHome  --changeDetection OnPush --module views/user
ng g c views/shared/containers/safe  --export --changeDetection OnPush --module shared
```

To see the user and admin page included into the header and navigation you need secondary routes:

Replace codein app/views/user/user.component.html

```html
<cool-header-with-sidenav>
  <ng-container navlist>
    <mat-nav-list>
      <a mat-list-item routerLink="" routerLinkActive="active">Home</a>
      <a mat-list-item routerLink="/user" routerLinkActive="active">UserHome</a>
    </mat-nav-list>
  </ng-container>
  <div body>
    <router-outlet name="secondary"></router-outlet>
    <a [routerLink]="[{outlets: { secondary: ['safe'] } }]">Safe</a>
  </div>
</cool-header-with-sidenav>
```

Add SharedModule to user.module.ts

Add router outlet to app/app.component.html

```html
<router-outlet></router-outlet>
```

Add routes to app/views/user/user.routing.module.ts

```typescript
const routes: Routes = [
  {
    path: "home",
    component: UserComponent,
    children: [
      {
        path: "safe",
        component: SafeComponent,
        outlet: "secondary"
      },
      {
        path: "",
        component: UserHomeComponent,
        outlet: "secondary"
      }
    ]
  },
  {
    path: "",
    redirectTo: "home"
  }
];
```

</details>

[Next](chapter6.md)
