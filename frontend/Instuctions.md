# Instructions

## 1. Setup
```bash
# Install the Angular CLI
npm i -g @angular/cli
```


## 2. Create and Start your Angular App
```bash
ng new frontend --routing --style scss

# Change to the directory containing your Angular App
cd frontend

# Start your Angular App
ng serve
```
Path to your Angular App: http://localhost:4200/

Adjust app prefixes
<ul>
<li>Change prefix from app to 'cool' in src/tslint.json</li>
<li>Change prefix from app to 'cool' in angular.json</li>
</ul>

## 3. Add Angular Material and your first module
```bash
# Add Angular Material
ng add @angular/material

# Generate shared module
ng generate module shared --module app

# Generate Angular Material navigation
ng g @angular/material:nav shared/components/sidenav --changeDetection OnPush --export --module shared --selector cool-sidenav
```

Add to app.component.html
```html
<cool-sidenav></cool-sidenav>
<router-outlet></router-outlet>
```

## 4. Generate all needed modules
```bash
cd frontend
# Generate Core 
ng generate module core --module app

# Remove "SharedModule" from app.module.ts
rm -rf src/app/shared/

# Generate new shared module
ng generate module shared

# Generate home, user and admin modules
ng g module views/home --routing
ng g module views/user --routing
ng g module views/admin --routing
```

## 5. Add Routing
Add router-outlet to app.component.html
```html
<router-outlet></router-outlet>
```

```bash
# Generate header with sidenav
ng g @angular/material:nav shared/components/header-with-sidenav --changeDetection OnPush --export --module shared --selector cool-header-with-sidenav
```

Add content to src\app\shared\components\header-with-sidenav\header-with-sidenav.component.html
Replace mat-nav-list content with
```html
<ng-content select="[navlist]"></ng-content>
```
Replace "<!-- Add Content Here -->"
```html
<ng-content select="[body]"></ng-content>
```

```bash
# Generate home view
ng g c views/home/home --changeDetection OnPush --module views/home
```

Add content to src\app\views\home\home\home.component.html
```html
<cool-header-with-sidenav>
  <ng-container navlist>
    <a mat-list-item routerLink="/admin" routerLinkActive="active">Login as Admin</a>
    <a mat-list-item routerLink="/user" routerLinkActive="active">Login as User</a>
  </ng-container>
  <p body>home works</p>
</cool-header-with-sidenav>
```

Add SharedModule to HomeModule.

Add routing configuration to home module.
```TypeScript
const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  }
];
```
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

Continue Secondary Routes




