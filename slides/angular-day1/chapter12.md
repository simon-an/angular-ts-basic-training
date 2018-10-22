## Exercise 12.1

- Use the currency pipe in item-list.component.html

<details><summary>Solution</summary>

- item-list.component.html

```html
<ul>
  <li *ngFor="let item of items">{{item?.name}}
    <span *ngIf="item!.price">
      {{item!.price | currency:'EUR':true}}
    </span>
  </li>
</ul>
```

- app.module.ts

```typescript
import { BrowserModule } from "@angular/platform-browser";
import { NgModule, LOCALE_ID } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CoreModule } from "./core/core.module";
import localeDe from "@angular/common/locales/de";
import { registerLocaleData } from "@angular/common";

registerLocaleData(localeDe, "de");

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreModule
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: "de-DE"
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

</details>

Exercise 12.2

- Translate some text.
