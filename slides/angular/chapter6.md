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
export class Safe {
  id: string;
  value: number;
  itemSize: number;
  active: boolean;
  activeSince: Date;
}

// app\core\model\safeitem.ts
export class SafeItem {
  id: string;
  name: string;
}
```

## Exercise 6.1.2 Create global service: SafeService

```bash
ng g s core/services/safe
```

<details>
<summary>Show Code</summary>

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

</details>

## Exercise 6.1.3 Create Barrel files for core module

<details><summary>src/app/core/index.ts</summary>

Right click folder src/app/core -> Create Barrel (Directories) (Extension: NG42 TypeScript Helpers)

```typescript
// start:ng42.barrel
export * from "./model";
export * from "./services";
// end:ng42.barrel
```

</details>
<details><summary>src/app/core/model/index.ts</summary>

Right click folder src/app/core -> Create Barrel (Files) (Extension: NG42 TypeScript Helpers)

```typescript
// start:ng42.barrel
export * from "./safe";
export * from "./safeitem";
// end:ng42.barrel
```

</details>
<details><summary>src/app/core/services/index.ts</summary>

Right click folder src/app/core -> Create Barrel (Files) (Extension: NG42 TypeScript Helpers)

```typescript
// start:ng42.barrel
export * from "./safe.service";
// end:ng42.barrel
```

</details>

## Exercise 6.1.4 userhome.component show list of safes

Hint: call safeservice.getSafes()

<details><summary>Solution</summary>

userhome.component.html

```html
<p>Safe List</p>
<ul>
  <li *ngFor="let safe of (safes$ | async)">
    {{safe?.id}} - {{safe?.value}}€ size: {{safe?.itemSize}}
  </li>
</ul>
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

</details>

## Exercise 6.2 Create item list in safe.component

![62](screenshots/62.PNG)

## Exercise 6.2.1 Routing to safe component 'safe/:id'

<details><summary>userhome.component.html</summary>

```html
<p>Safe List</p>
<ul>
  <li *ngFor="let safe of (safes$ | async)">
    {{safe?.id}} - {{safe?.value}}€ size: {{safe?.itemSize}}
    <a [routerLink]="[{outlets: { secondary: ['safe', safe.id] }  }]">Go To Safe {{safe?.id}}</a>
  </li>
</ul>
```

</details>

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
