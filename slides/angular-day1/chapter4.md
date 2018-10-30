# Chapter 4
## Exercise: 4.1 
### Add Angular Material and your first module:
```bash
# Add Angular Material
ng add @angular/material

# Generate shared module
ng generate module shared --module app

# Generate Angular Material navigation
ng g @angular/material:nav --name shared/components/sidenav --changeDetection OnPush --export --module shared --selector cool-sidenav
```

Add to app.component.html
```html
<cool-sidenav></cool-sidenav>
<router-outlet></router-outlet>
```

### Generate all needed modules
```bash
cd frontend
# Generate core module 
ng generate module core --module app

# Remove "SharedModule" from app.module.ts, we will regenerate it
rm -rf src/app/shared/

# Generate new shared module
ng generate module shared

# Generate home, user and admin modules
ng g module views/home --routing
ng g module views/user --routing
ng g module views/admin --routing
```

## Exercise: 4.2
### Add router-outlet to app.component.html
```html
<router-outlet></router-outlet>
```

```bash
# Generate header with sidenav
ng g @angular/material:nav -name shared/components/header-with-sidenav --changeDetection OnPush --export --module shared --selector cool-header-with-sidenav
```

### Add content to src\app\shared\components\header-with-sidenav\header-with-sidenav.component.html
Replace mat-nav-list with
```html
<ng-content select="[navlist]"></ng-content>
```
Replace "Add Content Here" comment
```html
<ng-content select="[body]"></ng-content>
```

### Home View
```bash
# Generate home view
ng g c views/home/home --changeDetection OnPush --module views/home
```
Add content to src\app\views\home\home\home.component.html
```html
<cool-header-with-sidenav>
  <ng-container navlist>
    <mat-nav-list>
      <a mat-list-item routerLink="/admin" routerLinkActive="active">Login as Admin</a>
      <a mat-list-item routerLink="/user" routerLinkActive="active">Login as User</a>
    </mat-nav-list>
  </ng-container>
  <p body>home works</p>
</cool-header-with-sidenav>
```
Add SharedModule and MatListModule to home.module.ts

Add routing configuration to home module.
```TypeScript
const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  }
];
```

### Admin View
```bash
# Generate admin view
ng g c views/admin/admin --changeDetection OnPush --module views/admin
```
Add routing configuration to admin module.
<details><summary>Show Solution</summary>

```TypeScript
const routes: Routes = [
  {
    path: '',
    component: AdminComponent
  }
];
```
</details>

### User View
```bash
# Generate user view
ng g c views/user/user --changeDetection OnPush --module views/user
```
Add routing configuration to user module.
<details><summary>Show Solution</summary>

```TypeScript
const routes: Routes = [
  {
    path: '',
    component: UserComponent
  }
];
```
</details>

Configure routing of the whole app
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
Now you can navigate to the user and the admin page.

## Exercise: 4.3
To see the user and admin page included into the header and navigation you need secondary routes:

```bash
ng g c views/user/components/userhome  --changeDetection OnPush --module views/user
ng g c views/user/containers/safe  --changeDetection OnPush --module views/user
```

Add router outlet to user.component.html
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

Add router outlet to app.component.html
```html
<router-outlet #routerOutlet="outlet"></router-outlet>
```

Add routes to user.routing.module.ts
```typescript
const routes: Routes = [
  {
    path: 'home',
    component: UserComponent,
    children: [
      {
        path: 'safe',
        component: SafeComponent,
        outlet: 'secondary'
      },
      {
        path: '',
        component: UserHomeComponent,
        outlet: 'secondary'
      }
    ],
  },
  {
    path: '',
    redirectTo: 'home'
  }
];
```
