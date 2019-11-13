# Exercise 12

## Exercise 12.1 Currency Pipe

- Use the currency pipe in item-list.component.html
- [Docs](https://angular.io/api/common/CurrencyPipe)

<details><summary>Solution</summary>

- item-list.component.html

```html
<ul>
  <li *ngFor="let item of items">{{item?.name}}
    <span *ngIf="item!.price">
      {{item!.price | currency:'EUR':'symbol'}}
    </span>
  </li>
</ul>
```

- core.module.ts

```typescript
 // ...
import localeDe from "@angular/common/locales/de";
import { registerLocaleData } from "@angular/common";

registerLocaleData(localeDe, "de");

 // ...
  providers: [
    // ...
    {
      provide: LOCALE_ID,
      useValue: "de-DE"
    }
  ],
```

</details>

## Exercise 12.2 Translate some text

## Exercise 12.2.1 ngx-translate

```bash
npm i -S @ngx-translate/core
npm i -S @ngx-translate/http-loader
```

- Setup the view modules like this:

```typescript
import {
  TranslateModule,
  TranslateLoader,
  TranslateService
} from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/admin/", ".json");
}

@NgModule({
  // ...
  imports: [
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      },
      isolate: true
    })
    // ...
  ]
})
export class AdminModule {
  constructor(translateService: TranslateService) {
    translateService.setDefaultLang("de");
    translateService.use("de");
  }
}
```

```typescript
import {
  TranslateModule,
  TranslateLoader,
  TranslateService
} from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

registerLocaleData(localeDe, "de");

@NgModule({
  // ...
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
    // ...
  ]
})
export class CoreModule {
  constructor(translateService: TranslateService) {
    translateService.setDefaultLang("de");
    translateService.use("de");
  }
}
```

- add the constructor and import and export of the TranslateModule to the LayoutModule, SafeModule

```typescript
constructor(translateService: TranslateService) {
    translateService.setDefaultLang('de');
    translateService.use('de');
  }
```

- create src/assets/i18n/admin/de.json

`````json
{
  "AppName" : "Cool Safe - Admin Area",
  "Safes" : "Tresore",
  "Items" : "Gegenstände"
}

```

- create src/assets/i18n/admin/en.json

````json
{
  "AppName" : "Cool Safe - Admin Area",
  "Safes" : "Safes",
  "Items" : "Items"
}

```

- create src/assets/i18n/user/en.json

```json
{
  "AppName" : "Cool Safe - User Area",
  "Safes" : "Safes",
  "Items" : "Items",
  "WelcomeUser": "Welcome to Cool Safe App Mr Holmes.",
  "SafeLink": "Your Safe"
}


```

- create src/assets/i18n/user/de.json

```json
{
  "AppName" : "Der Coole Tresor - Kundenbereich",
  "Safes": "Tresore",
  "Items": "Gegenstände",
  "WelcomeUser": "Willkommen bei ihrem Safe Herr Mustermann",
  "SafeLink": "Dein Tresor"
}

```

- create src/assets/i18n/de.json

```json
{
  "AppName" : "Der Coole Tresor",
  "WelcomeMessage" : "Willkommen in Ihren Tresor.",
  "RegisterMessage" : "Bitte loggen Sie sich ein oder melden Sie sich an."
}
```

- create src/assets/i18n/en.json

```json
{
  "AppName" : "Cool Safe",
  "WelcomeMessage" : "Welcome to the Cool Safe App.",
  "RegisterMessage" : "Please login or register as a new user."
}
```

<details><summary>Solution Templates</summary>

- header-with-sidenav.component.html

``` html
    <span>{{ 'AppName' | translate }}</span>
```

- home-landing-page.component.html

``` html
    <h2>{{ 'WelcomeMessage' | translate }}</h2>
    <p>{{ 'RegisterMessage' | translate }}</p>
```

- user-landing-page.component.html

``` html
     <p mat-line>{{ 'SafeLink' | translate }}</p>
```

</details>
`````
