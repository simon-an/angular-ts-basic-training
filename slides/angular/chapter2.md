# Chapter 2

## Exercise: 2.0

### Add .prettierrc file

```json
{
  "printWidth": 120,
  "singleQuote": true,
  "useTabs": false,
  "tabWidth": 2,
  "semi": true,
  "bracketSpacing": true
}
```

## Exercise: 2.1

Setup Angular CLI and create and start your Angular App

```bash
# Install the Angular CLI
npm i -g @angular/cli
```

```bash
ng new frontend --routing --style scss

# Change to the directory containing your Angular App
cd frontend

# Start your Angular App
ng serve
```

Path to your Angular App: http://localhost:4200/

## Exercise: 2.2

Configure your app

Adjust app prefixes

- Change prefix from "app" to "cool" in src/tslint.json
- Change prefix from "app" to "cool" in angular.json
- Change `<app-root></app-root>` to `<cool-root></cool-root>` in src/index.html
