# Chapter 6

## Exercise 6.0 Create core module

```bash
ng generate module core --module app
```

## Exercise 6.1 Create safe list in user.component

![61](screenshots/61.PNG)

## Exercise 6.1.1 Create models: Safe, SafeItem

```typescript
// app\core\model\safe.ts
export interface Safe {
  id: string;
  value: number;
  itemSize: number;
  active: boolean;
  activeSince: Date;
}

// app\core\model\safeitem.ts
export interface SafeItem {
  id: string;
  name: string;
}
```

## Exercise 6.1.2 Create global service: SafeService (this is a temporary mock service)

```bash
ng g s core/services/safe
```

- safe.service should provice data to pass the following test:

TODO add test here.

- add mock code to safe.service.ts

<details>
<summary>Show Solution</summary>

```typescript
import { Injectable } from "@angular/core";
import { Safe, SafeItem } from "../model";
import { Observable, Subject, BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class SafeService {
  // private currentSafe: Subject<Safe> = new Subject<Safe>();
  private safes: BehaviorSubject<Safe[]> = new BehaviorSubject<Safe[]>([]);
  private items: BehaviorSubject<SafeItem[]> = new BehaviorSubject<SafeItem[]>(
    []
  );

  getSafe(safeId: string): Observable<Safe> {
    return this.safes
      .asObservable()
      .pipe(map((safes1: Safe[]) => safes1.find(safe => safe.id === safeId)));
  }

  getSafes(): Observable<Safe[]> {
    return this.safes.asObservable();
  }

  getItems(safeId: string): Observable<SafeItem[]> {
    this.items.next(null);
    setTimeout(() => {
      if (safeId === "1") {
        this.items.next([
          { id: "1", name: "Fahrrad" },
          { id: "2", name: "Laptop" }
        ] as SafeItem[]);
      } else if (safeId === "2") {
        this.items.next([
          { id: "3", name: "Taschenrechner" },
          { id: "4", name: "Sonnenbrille" },
          { id: "5", name: "Brille" }
        ] as SafeItem[]);
      }
    }, 2000);
    return this.items.asObservable();
  }

  constructor() {
    this.safes.next([
      {
        id: "1",
        value: 999,
        itemSize: 2,
        active: true,
        activeSince: new Date()
      },
      {
        id: "2",
        value: 123,
        itemSize: 3,
        active: true,
        activeSince: new Date()
      }
    ] as Safe[]);
  }
}
```

There is a tslint quotemark error. Format your code with Shift+Alt+F and Prettier will fix this error

</details>

## Exercise 6.1.3 Create Barrel files for core module

<details><summary>Create barrel file for the core module models</summary>

Right click folder src/app/core/model -> Create Barrel (Files) (Extension: NG42 TypeScript Helpers)

src/app/core/model/index.ts
```typescript
// start:ng42.barrel
export * from "./safe";
export * from "./safeitem";
// end:ng42.barrel
```

</details>

<details><summary>Create barrel file for the core module</summary>

Right click folder src/app/core -> Create Barrel (Directories) (Extension: NG42 TypeScript Helpers)

src/app/core/index.ts
```typescript
// start:ng42.barrel
export * from "./model";
export * from "./services";
// end:ng42.barrel
```

</details>

<details><summary>Create barrel file for the service directory</summary>

Right click folder src/app/core -> Create Barrel (Files) (Extension: NG42 TypeScript Helpers)

src/app/core/services/index.ts
```typescript
// start:ng42.barrel
export * from "./safe.service";
// end:ng42.barrel
```

</details>

## Exercise 6.1.4 userhome.component show list of safes

```bash
ng g c views/user/containers/userHome --changeDetection OnPush --module views/user
ng g c shared/components/safe-list --export --changeDetection OnPush --module shared
```

1. Adjuste routing of user-routing.module.ts:
```typescript
const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    redirectTo: 'home'
  }, {
    path: 'home',
    component: UserHomeComponent
  }
]
```
2. In safe.component get safes in ngOnInit from safe.serviceof smart safe.component
3. In safe-list.component get the safes from an @Input (Use @Input: https://angular.io/api/core/Input)
4. Show the list of safe ids with ngFor and {{}}
5. Give the safes to the safe.component with the innput directive (https://angular.io/api/core/Input)

<details><summary>Solution</summary>

userhome.component.html

```html
<cool-safe-list [safes]="safes$ | async"></cool-safe-list>
```

userhome.component.ts

```typescript
import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { Safe, SafeService } from "src/app/core";
import { Observable } from "rxjs";

@Component({
  selector: "cool-userhome",
  templateUrl: "./userhome.component.html",
  styleUrls: ["./userhome.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserHomeComponent implements OnInit {
  safes$: Observable<Safe[]>;

  constructor(private service: SafeService) {}

  ngOnInit() {
    this.safes$ = this.service.getSafes();
  }
}
```

safe-list.component.html

```html
<ul>
  <li *ngFor="let safe of safes">
    <a [routerLink]="[{outlets: { secondary: ['safe', safe.id] }  }]">Go To Safe {{safe?.id}}</a>
    {{safe?.value}}€ size: {{safe?.itemSize}}
  </li>
</ul>
```

safe-list.component.ts

```typescript
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from "@angular/core";
import { Safe } from "~core/*";

@Component({
  selector: "cool-safe-list",
  templateUrl: "./safe-list.component.html",
  styleUrls: ["./safe-list.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SafeListComponent implements OnInit {
  @Input()
  safes: Safe[];

  constructor() {}

  ngOnInit() {}
}
```

</details>

## Exercise 6.2 Create item list in safe.component

![62](screenshots/62.PNG)

```bash
ng g c shared/containers/safe --export --changeDetection OnPush --module shared
```


## Exercise 6.2.1 Routing to safe component 'safe/:id'

### Solution with secondary routing (named router-outlet & child routes)

<details><summary>user-routing.module.ts (short)</summary>

```typescript
...
{
  path: 'safe/:id',
  component: SafeComponent,
  outlet: 'secondary',
},
...
```

</details>

<details><summary>user-routing.module.ts (long)</summary>

```typescript
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UserComponent } from "./user/user.component";
import { SafeComponent } from "./containers/safe/safe.component";
import { UserHomeComponent } from "./components/userhome/userhome.component";

const routes: Routes = [
  {
    path: "home",
    component: UserComponent,
    children: [
      {
        path: "safe/:id",
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

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
```

</details>


### Solution using the main router-outlet

<details><summary>user-routing.module.ts (short)</summary>

```typescript
...
{
  path: 'safes/:id',
  component: SafeComponent,
},
...
```

</details>

<details><summary>user-routing.module.ts (long)</summary>

```typescript

```

</details>



## Exercise 6.2.2 safe.component subscribe to service and routeparam and get safe and its items

<details><summary>safe.component.ts</summary>

```typescript
import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { switchMap } from "rxjs/operators";
import { Observable } from "rxjs";
import { Safe, SafeService, SafeItem } from "src/app/core";

@Component({
  selector: "cool-safe",
  templateUrl: "./safe.component.html",
  styleUrls: ["./safe.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SafeComponent implements OnInit {
  safe$: Observable<Safe>;
  items$: Observable<SafeItem[]>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: SafeService
  ) {}

  ngOnInit() {
    this.safe$ = this.activatedRoute.paramMap.pipe(
      switchMap((params: ParamMap) => this.service.getSafe(params.get("id")))
    );
    this.items$ = this.safe$.pipe(
      switchMap((safe: Safe) => this.service.getItems(safe.id))
    );
  }
}
```

</details>

## Exercise 6.2.3 Itemlist component show list of safe items

Generate item-list component:

1. Right click "src\app\shared\components"
2. Select "Angular: Generate a component"
3. Enter name "itemList" and press Enter
4. Select "Exported pure component" and select "Confirm"

<details><summary>safe.component.html</summary>

```html
<cool-item-list [items]="items$ | async"></cool-item-list>
```

</details>

<details><summary>item-list.component.html</summary>

```html
<ul>
  <li *ngFor="let item of items">{{item?.name}}</li>
</ul>
```

</details>
<details><summary>item-list.component.ts</summary>

```typescript
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from "@angular/core";
import { SafeItem } from "src/app/core";

@Component({
  selector: "cool-item-list",
  templateUrl: "./item-list.component.html",
  styleUrls: ["./item-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemListComponent implements OnInit {
  @Input()
  items: SafeItem[];

  constructor() {}

  ngOnInit() {}
}
```

</details>
