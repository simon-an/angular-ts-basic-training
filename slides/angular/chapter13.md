# Exercise 13 - Implement SafeItem Actions and Reducer

## 13.1 Install schematics

<https://github.com/ngrx/platform/tree/master/docs/schematics>

```bash
npm install @ngrx/schematics --save-dev

ng config cli.defaultCollection @ngrx/schematics
```

UNIX

```bash
npm install @ngrx/{store,effects,entity,store-devtools} --save
```

WINDOWS

```bash
npm install @ngrx/store @ngrx/effects @ngrx/entity @ngrx/store-devtools -S
```

## 13.2 Generate the Store

```bash
ng g module root-store —-flat false —-module app.module.ts
ng generate @ngrx/schematics:store State --statePath root-store --root --module root-store/root-store.module.ts
```

Add RootStoreModule to app.module.ts.

## 13.3 Add feature Safe

```bash
ng g @ngrx/schematics:feature root-store/Safe --flat --group --reducers index.ts
```

Result:

```bash
src\app\root-store\
├── actions
│   └── safe.actions.ts
├── effects
│   ├── safe.effects.spec.ts
│   └── safe.effects.ts
├── reducers
│   ├── safe.reducer.spec.ts
│   └── safe.reducer.ts
├── root-store.module.ts
└── index.ts
```

## 13.4 Add Metareducer Store Freeze, to detect shared state errors during development

- Only needed with ngrx6. When ngrx7 is released it will be included.

```bash
 npm i -D ngrx-store-freeze
```

add to root-store/state/index.ts

```typescript
import { storeFreeze } from 'ngrx-store-freeze';
...
export const metaReducers: MetaReducer<State>[] = !environment.production ? [storeFreeze] : [];
```

## 13.5 Create Safes state in shared module

- State for safe.reducer will look like this.

```typescript
export interface State {
  safes: Safe[];
  pending: boolean;
}
```

Add action events to root-store/actions/safe.actions.ts:

- Add action event "Load Safes On Items Change" from Source "User".
- Add action event "Load Safes" from Source "Admin".
- Add action event "Load Safes Success" from Source "Safe API".
- Add action event "Load Safes Failure" from "Safe API"

<details><summary>Solution root-store/actions/safe.actions.ts</summary>

```typescript
import { Action } from "@ngrx/store";
import { Safe } from "../model/safe";

export enum SafeActionTypes {
  UserLoadSafeOnItemsChange = "[User Safe Page] Load Safe On Items Change",
  AdminLoadSafes = "[Admin Landing Page] Load Safes",
  UserLoadSafe = "[User Landing Page] Load Safe",
  LoadSafesSuccess = "[Safe API] Load Safes Success",
  LoadSafesFailure = "[Safe API] Load Safes Failure",
  LoadSafeSuccess = "[Safe API] Load Safe Success",
  LoadSafeFailure = "[Safe API] Load Safe Failure"
}

export class LoadSafeOnItemsChange implements Action {
  readonly type = SafeActionTypes.UserLoadSafeOnItemsChange;

  constructor(public payload: { safeId: string; userId: string }) {}
}
export class AdminLoadSafes implements Action {
  readonly type = SafeActionTypes.AdminLoadSafes;
}
export class UserLoadSafe implements Action {
  readonly type = SafeActionTypes.UserLoadSafe;

  constructor(public payload: { safeId: string; userId: string }) {}
}
export class LoadSafeSuccess implements Action {
  readonly type = SafeActionTypes.LoadSafeSuccess;

  constructor(public payload: { safe: Safe }) {}
}
export class LoadSafeFailure implements Action {
  readonly type = SafeActionTypes.LoadSafeFailure;
}
export class LoadSafesSuccess implements Action {
  readonly type = SafeActionTypes.LoadSafesSuccess;

  constructor(public payload: { safes: Safe[] }) {}
}
export class LoadSafesFailure implements Action {
  readonly type = SafeActionTypes.LoadSafesFailure;
}

export type SafeActions =
  | LoadSafeOnItemsChange
  | AdminLoadSafes
  | UserLoadSafe
  | LoadSafesSuccess
  | LoadSafeSuccess
  | LoadSafesFailure
  | LoadSafeFailure;
```

</details>

Add action types to reducer root-store/reducers/safe.reducer.ts

<details><summary>Solution root-store/reducers/safe.reducer.ts</summary>

```typescript
import { Action } from "@ngrx/store";
import { SafeActions, SafeActionTypes } from "../actions/safe.actions";
import { Safe } from "../model/safe";

export interface State {
  safes: Safe[];
  pending: boolean;
}

export const initialState: State = {
  safes: [],
  pending: false
};

export function reducer(state = initialState, action: SafeActions): State {
  switch (action.type) {
    case SafeActionTypes.UserLoadSafe:
    case SafeActionTypes.AdminLoadSafes:
    case SafeActionTypes.UserLoadSafeOnItemsChange:
      return { ...state, pending: true };
    case SafeActionTypes.LoadSafesSuccess:
      return { safes: [...action.payload.safes], pending: false };
    case SafeActionTypes.LoadSafeSuccess:
      return { safes: [...state.safes, action.payload.safe], pending: false };
    case SafeActionTypes.LoadSafeFailure:
    case SafeActionTypes.LoadSafesFailure:
      return { ...state, pending: false };
    default:
      return state;
  }
}
```

</details>

## 13.6 Subscribe to State

- create selector in root-store/selectors/safe.selector.ts

```typescript
import { createFeatureSelector, createSelector } from "@ngrx/store";
import { State } from "..";

const selectSlice = (state: State) => state.safe;
```

Add selectors "selectSafe", "selectSafes" and "selectSafesLoading".

<details><summary>Solution root-store/selectors/safe.selector.ts</summary>

```typescript
import { createFeatureSelector, createSelector } from "@ngrx/store";
import { State } from "..";

const selectSlice = (state: State) => state.safe;

export const selectSafes = createSelector(selectSlice, state => state.safes);

export const selectSafe = createSelector(
  selectSlice,
  (state, params: { safeId: string }) =>
    state.safes.find(s => s.id === params.safeId)
);

export const selectSafesLoading = createSelector(
  selectSlice,
  state => state.pending
);
```

</details>

- In user/container/userhome/userhome.component.ts add "selectSafes" and "selectSafesLoading" selector and dispatch the LoadUserSafes action.

Hint: dont remove safe service from constructor, to make sure it is provided.

 <details><summary>Solution user/container/safe-page/safe-page.component.ts</summary>

```typescript
import { Observable, merge, Subject, BehaviorSubject } from "rxjs";
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from "@angular/core";
import { SafeService } from "~core/services";
import { SafeItem } from "~core/model";
import { ActivatedRoute, ParamMap } from "@angular/router";
import {
  switchMap,
  withLatestFrom,
  filter,
  exhaustMap,
  concatMap,
  mergeMap,
  tap
} from "rxjs/operators";
import { MatDialog } from "@angular/material";
import { AddSafeItemDialogComponent } from "../add-safe-item-dialog/add-safe-item-dialog.component";
import { State } from "app/root-store";
import { Store, select } from "@ngrx/store";
import { Safe } from "app/root-store/model/safe";
import {
  selectSafesLoading,
  selectSafe
} from "app/root-store/selectors/safe.selector";
import { UserLoadSafe } from "app/root-store/actions/safe.actions";

@Component({
  templateUrl: "./safe-page.component.html",
  styleUrls: ["./safe-page.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SafePageComponent implements OnInit {
  safe$: Observable<Safe>;
  items$: Observable<SafeItem[]>;
  loading$: Observable<boolean>;
  userId: "111";
  isCustomer = true; // TODO provide through dependency injection

  constructor(
    private store: Store<State>,
    private activatedRoute: ActivatedRoute,
    private service: SafeService,
    private dialogService: MatDialog
  ) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(selectSafesLoading));

    this.safe$ = this.activatedRoute.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.store.dispatch(
          new UserLoadSafe({ safeId: params.get("id"), userId: this.userId })
        );
        return this.store.pipe(
          select(selectSafe, { safeId: params.get("id") })
        );
      })
    );
  }

  addSafeItem() {
    const dialogRef = this.dialogService.open(AddSafeItemDialogComponent, {
      height: "400px",
      width: "600px"
    });
    dialogRef
      .afterClosed()
      .pipe(withLatestFrom(this.safe$))
      .subscribe(([result, safe]: [SafeItem, Safe]) => {
        //   console.log(`Dialog result:`, result);
        if (result) {
          result.safeId = safe.id;
          const result$ = this.service.addItem(safe.id, result);
          result$.subscribe(item => {
            // console.log('new item id: ', item.id);
          });
        }
      });
  }
}
```

```html
 <p>{{ (safe$ | async)?.value }}</p>
```

</details>

- Remove Resolver service.

## 13.7 Create Spinner

No Safes are loaded yet. So lets add a Spinner.

Add to safe-list.component.html

```html
<mat-spinner *ngIf="pending$| async"></mat-spinner>
```

## 13.8 Add Router-State to root-store

- add @ngrx/router-store

```bash
npm i -S @ngrx/router-store
```

- custom serializer for secondary router state root-store/router-serializer.ts

```typescript
import { Params, RouterStateSnapshot } from "@angular/router";
import { RouterStateSerializer } from "@ngrx/router-store";

export interface RouterStateUrl {
  url: string;
  params: Params;
  queryParams: Params;
}

export class CustomSerializer implements RouterStateSerializer<RouterStateUrl> {
  constructor() {}

  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    let route = routerState.root;

    while (route.children.length > 0) {
      if (route.children.length > 1) {
        route = route.children.find(
          r => (!!r.params && !!r.params.id) || r.outlet === "secondary"
        );
      }
      if (!route || route.children.length === 1) {
        route = route.firstChild;
      }
    }

    const {
      url,
      root: { queryParams }
    } = routerState;
    const { params } = route;

    // Only return an object including the URL, params and query params
    // instead of the entire snapshot
    return { url, params, queryParams };
  }
}
```

- add to root-store.module.ts

```typescript
...

imports: [
...
  StoreRouterConnectingModule.forRoot({
        stateKey: 'router'
  })
],

...

providers: [{ provide: RouterStateSerializer, useClass: CustomSerializer }]
```

- Add the router state selector and router reducert to root-store/state.index.ts

add routerReducer to ActionReducerMap
add selector for router state

```typescript
export const reducers: ActionReducerMap<State> = {
  router: routerReducer
};
...
export const getRouterState = createFeatureSelector<RouterReducerState<RouterStateUrl>>('router');
...
```
