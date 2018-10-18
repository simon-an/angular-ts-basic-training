# Instructions

## Setup
```bash
# Install the Angular CLI
npm i -g @angular/cli
```

```bash
# Create your Angular App
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

