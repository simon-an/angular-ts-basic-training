# Chapter 6

## Exercise 6.0 Create core module

```bash
ng generate module core --module app
```

## Exercise 6.1 Create Safe List

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
  users: string[];
}

// app\core\model\safe-item.ts
export interface SafeItem {
  id: string;
  name: string;
  price: number;
  safeId: string;
}
```

## Exercise 6.1.2 Create Barrel files for core module

Add safe.service.ts (implementation will be done in the next exercise).

```bash
ng g s core/services/safe
```

### Create barrel file for the core module models

Right click folder src/app/core/model -> Create Barrel (Files) (Extension: NG42 TypeScript Helpers)

Result: src/app/core/model/index.ts

```typescript
// start:ng42.barrel
export * from "./safe";
export * from "./safeitem";
// end:ng42.barrel
```

<details><summary>Create barrel file for the core module</summary>

Right click folder src/app/core -> Create Barrel (Directories) (Extension: NG42 TypeScript Helpers)

Result: src/app/core/index.ts

```typescript
// start:ng42.barrel
export * from "./model";
export * from "./services";
// end:ng42.barrel
```

</details>

<details><summary>Create barrel file for the service directory</summary>

Right click folder src/app/core -> Create Barrel (Files) (Extension: NG42 TypeScript Helpers)

Result: src/app/core/services/index.ts

```typescript
// start:ng42.barrel
export * from "./safe.service";
// end:ng42.barrel
```

</details>

## Exercise 6.1.3 Implement global service: SafeService (this is a temporary mock service)

- safe.service should provide data to pass the following test:

<details>
<summary>Karma Test</summary>

```typescript
import { TestBed } from "@angular/core/testing";

import { SafeService } from "./safe.service";
import { filter, delay } from "rxjs/operators";

describe("SafeService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: SafeService = TestBed.get(SafeService);
    expect(service).toBeTruthy();
  });
  it("test safe id 1", (done: DoneFn) => {
    const service: SafeService = TestBed.get(SafeService);
    service.getSafe("1").subscribe(safe => {
      expect(safe.active).toBe(true);
      expect(safe.activeSince).toEqual(new Date(1999, 1, 1));
      expect(safe.id).toBe("1");
      expect(safe.itemSize).toBe(2);
      expect(safe.value).toBe(999);
      expect(safe.users.length).toBe(1);
      done();
    });
  });
  it("test safe id 2", (done: DoneFn) => {
    const service: SafeService = TestBed.get(SafeService);
    service.getSafe("2").subscribe(safe => {
      expect(safe.active).toBe(true);
      expect(safe.activeSince).toEqual(new Date(2018, 12, 30));
      expect(safe.id).toBe("2");
      expect(safe.itemSize).toBe(3);
      expect(safe.value).toBe(123);
      expect(safe.users.length).toBe(3);
      done();
    });
  });
  it("test safe id 0", (done: DoneFn) => {
    const service: SafeService = TestBed.get(SafeService);
    service.getSafe("0").subscribe(safe => {
      expect(safe).toBeUndefined();
      done();
    });
  });
  it("test safe id 3", (done: DoneFn) => {
    const service: SafeService = TestBed.get(SafeService);
    service.getSafe("3").subscribe(safe => {
      expect(safe).toBeUndefined();
      done();
    });
  });

  it("test safe items for safeId: 1", (done: DoneFn) => {
    const service: SafeService = TestBed.get(SafeService);
    service
      .getItems("1")
      .pipe(filter(Boolean))
      .subscribe(items => {
        expect(items.length).toBe(2);
        done();
      });
  });
  it("test safe items for safeId: 2", (done: DoneFn) => {
    const service: SafeService = TestBed.get(SafeService);
    service
      .getItems("2")
      .pipe(filter(Boolean))
      .subscribe(items => {
        expect(items.length).toBe(3);
        done();
      });
  });
  it("test safe items for invalid id", (done: DoneFn) => {
    const service: SafeService = TestBed.get(SafeService);
    service
      .getItems("12342453452343638234")
      .pipe(delay(2100))
      .subscribe(items => {
        expect(items).toBeNull();
        done();
      });
  });
  it("test safes", (done: DoneFn) => {
    const service: SafeService = TestBed.get(SafeService);
    service
      .getSafes()
      .pipe(delay(2100))
      .subscribe(safes => {
        expect(safes.length).toEqual(2);
        done();
      });
  });
});
```

</details>

- add mock code to safe.service.ts

<details>
<summary>Show Solution</summary>

```typescript
import { Injectable } from "@angular/core";
import { Safe, SafeItem } from "../model";
import { Observable, Subject, BehaviorSubject, AsyncSubject } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class SafeService {
  // private currentSafe: Subject<Safe> = new Subject<Safe>();
  private safes: BehaviorSubject<Safe[]> = new BehaviorSubject<Safe[]>([]);
  private items: Map<string, AsyncSubject<SafeItem[]>> = new Map<
    string,
    AsyncSubject<SafeItem[]>
  >();

  getSafe(safeId: string): Observable<Safe> {
    return this.safes
      .asObservable()
      .pipe(map((safes1: Safe[]) => safes1.find(safe => safe.id === safeId)));
  }

  getSafes(): Observable<Safe[]> {
    return this.safes.asObservable();
  }

  getItems(safeId: string): Observable<SafeItem[]> {
    if (!this.items.has(safeId)) {
      this.items.set(safeId, new AsyncSubject<SafeItem[]>());
      setTimeout(() => {
        if (safeId === "1") {
          this.items
            .get(safeId)
            .next([
              { id: "1", name: "Fahrrad", price: 55.5 },
              { id: "2", name: "Laptop", price: 999.99 }
            ] as SafeItem[]);
        } else if (safeId === "2") {
          this.items
            .get(safeId)
            .next([
              { id: "3", name: "Taschenrechner", price: 123.5 },
              { id: "4", name: "Sonnenbrille", price: 345 },
              { id: "5", name: "Brille", price: 567 }
            ] as SafeItem[]);
        } else {
          this.items.get(safeId).next(null);
        }
        this.items.get(safeId).complete();
      }, 2000);
    }

    return this.items.get(safeId).asObservable();
  }

  constructor() {
    this.safes.next([
      {
        id: "1",
        value: 999,
        itemSize: 2,
        users: ["111"],
        active: true,
        activeSince: new Date(1999, 1, 1)
      },
      {
        id: "2",
        value: 123,
        itemSize: 3,
        users: ["17", "19", "25"],
        active: true,
        activeSince: new Date(2018, 12, 30)
      }
    ] as Safe[]);
  }
}
```

There is a tslint quotemark error. Format your code with Shift+Alt+F and Prettier will fix this error

</details>

## Exercise 6.1.4 admin-landing-page.component should show list of safes

```bash
ng g c views/admin/container/safeList --changeDetection OnPush --module views/admin
ng g c views/admin/container/safeListElement --export --changeDetection OnPush --module views/admin
ng g c views/admin/components/safeRow --export --changeDetection OnPush --module views/admin
```

1. In safe-list.component get safes in ngOnInit from safe.service
2. In safe-list-element.component get the safe from an @Input [Use @Input:](https://angular.io/api/core/Input)
3. Show the list of safes with ngFor
4. Give the safes to the safe-list-row.component with the innput directive [@Input](https://angular.io/api/core/Input)
5. Use Mat-Nav-List for styling. [docs](https://material.angular.io/components/list/overview)
6. Find out, what's the best place to place a matToolTip.[docs](https://material.angular.io/components/tooltip/overview)

<details><summary>Solution</summary>

admin-landing-page.component.html

```html
<cool-header-with-sidenav>
  <ng-container navlist>
    <mat-nav-list>
      <a mat-list-item routerLink="/home" routerLinkActive="active"
        >Back to home</a
      >
    </mat-nav-list>
  </ng-container>
  <div body>
    <cool-safe-list></cool-safe-list>
  </div>
</cool-header-with-sidenav>
```

- safe-list.component.html

```html
<mat-nav-list>
  <h3 mat-subheader>Safes</h3>
  <cool-safe-list-element
    *ngFor="let safe of (safes$ | async)"
    [matTooltip]="safe.id"
    [safe]="safe"
  ></cool-safe-list-element>
</mat-nav-list>
```

- safe-list-element.component.html

```html
<cool-safe-row [matTooltip]="safe.id" [safe]="safe"> </cool-safe-row>
```

- safe-row.component.html

```html
<mat-list-item>
  <mat-icon mat-list-icon *ngIf="safe?.itemSize > 0; else empty">
    work
  </mat-icon>
  <ng-template #empty
    ><mat-icon mat-list-icon>work_outline</mat-icon></ng-template
  >
  <p mat-line>{{ safe?.value }}€</p>
  <p mat-line>size: {{ safe?.itemSize }}</p>
</mat-list-item>
```

</details>

## Exercise 6.2 Show Safe List on User Page

### Create item list in safe.component

![62](screenshots/62.PNG)

```bash
ng g c views/user/containers/safePage --export --changeDetection OnPush --module safe
```

## Exercise 6.2.1 Routing to safe component 'safe/:id'

<details><summary>Add routerLink to user-landing-page.component.html</summary>

```html
<cool-header-with-sidenav>
  <ng-container navlist>
    <mat-nav-list>
      <a mat-list-item routerLink="/home" routerLinkActive="active">Home</a>
      <mat-divider></mat-divider>
      <ng-container *ngIf="(safeId$ | async) as safeId">
        <a [routerLink]="'safes/' + safeId" mat-list-item *ngIf="safeId">
          <mat-icon mat-list-icon>work_outline</mat-icon>
          <p mat-line>Your Safe</p>
        </a>
      </ng-container>
    </mat-nav-list>
  </ng-container>
  <!-- Content Start -->
  <ng-container body>
    <p>Welcome to Cool Safe App Mr Holmes.</p>
  </ng-container>
  <!-- Content End -->
</cool-header-with-sidenav>
```

```typescript
safeId$: Observable<string>;

constructor() {
  this.safeId$ = of('1');
}
```

</details>

### Solution with secondary routing (named router-outlet & child routes) (TODO)

<details><summary>user-routing.module.ts (short)</summary>

```typescript
...
{
path: 'safes/:id',
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
        path: "safes/:id",
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
const routes: Routes = [
  {
    path: "",
    component: UserLandingPageComponent
  },
  {
    path: "safes/:id",
    component: SafePageComponent
  }
];
```

</details>

## Exercise 6.2.2 safe.component subscribe to service and routeparam and get safe and its items

<details><summary>safe-page.component.ts</summary>

```typescript
import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { switchMap } from "rxjs/operators";
import { Observable } from "rxjs";
import { Safe, SafeService, SafeItem } from "src/app/core";

import { Observable } from "rxjs";
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from "@angular/core";
import { SafeService } from "~core/services";
import { SafeItem, Safe } from "~core/model";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { switchMap } from "rxjs/operators";

@Component({
  templateUrl: "./safe-page.component.html",
  styleUrls: ["./safe-page.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SafePageComponent implements OnInit {
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

1. Right click "src\app\safe\components"
2. Select "Angular: Generate a component"
3. Enter name "itemList" and press Enter
4. Select "Exported pure component" and select "Confirm"

Or in the terminal:

```bash
ng g component safe/components/itemList --changeDetection OnPush
```

<details><summary>safe-page.component.html</summary>

```html
<cool-header-with-sidenav>
  <ng-container navlist>
    <mat-nav-list>
      <a mat-list-item routerLink="/home">Home</a>
      <mat-divider></mat-divider>
      <a mat-list-item routerLink="/user">Back</a>
    </mat-nav-list>
  </ng-container>
  <!-- Content Start -->
  <ng-container body>
    <cool-item-list [items]="items$ | async"></cool-item-list>
  </ng-container>
  <!-- Content End -->
</cool-header-with-sidenav>
```

</details>

<details><summary>item-list.component.html</summary>

```html
<h4 mat-subheader>Items</h4>
<mat-list *ngIf="items">
  <mat-list-item *ngFor="let item of items">
    <p matLine>{{ item?.name }}</p>
    <p matLine>{{ item?.price }}€</p>
  </mat-list-item>
</mat-list>
```

</details>
<details><summary>item-list.component.ts</summary>
Add an Input

```typescript
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from "@angular/core";
import { SafeItem } from "src/app/core/model";

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

[Next](chapter7.md)
