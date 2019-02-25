# Exercise 14: NGRX Entities

## 14.1 Add SafeItem Entity

```bash
ng g @ngrx/schematics:entity shared/store/safe/SafeItem --group --reducers state/index.ts
```

- remove src/app/shared/store/safe/models/safe-item.model.ts
- import existing model in generated files.

```typescript
import { SafeItem } from "~core/model";
```

- remove items state from safe.service.ts
- add LoadSafeItems action to getItems() of safe.service.ts

```typescript
tap((items: SafeItem[]) => this.store.dispatch(new LoadSafeItems({ safeItems: items }))),
```

<details><summary>SafeService Solution</summary>

```typescript
import { Injectable } from "@angular/core";
import { Safe, SafeItem } from "../model";
import {
  Observable,
  Subject,
  BehaviorSubject,
  timer,
  interval,
  ReplaySubject,
  of
} from "rxjs";
import {
  map,
  switchMap,
  switchMapTo,
  tap,
  concatMapTo,
  take,
  startWith,
  shareReplay,
  filter,
  catchError,
  delay
} from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Store, select } from "@ngrx/store";
import {
  selectSafes,
  selectSafesLoading
} from "~shared/store/safe/selectors/safe-list.selector";
import {
  LoadSafeListsSuccess,
  LoadSafeAfterUserAddItem,
  LoadSafeListsFailure
} from "~shared/store/safe/actions/safe-list.actions";
import { State } from "app/root-store/state";
import { LoadSafeItems } from "~shared/store/safe/actions/safe-item.actions";

@Injectable({
  providedIn: "root"
})
export class SafeService {
  private readonly safesUrl = "/api/safes";

  constructor(private http: HttpClient, private store: Store<State>) {
    store
      .pipe(
        select(selectSafesLoading),
        filter(Boolean),
        switchMapTo(this.loadSafes()),
        catchError(err => {
          this.store.dispatch(new LoadSafeListsFailure());
          return of(null);
        }),
        filter(Boolean),
        delay(2000)
      )
      .subscribe(safes =>
        this.store.dispatch(new LoadSafeListsSuccess({ safes: safes }))
      );
  }

  loadSafes(): Observable<Safe[]> {
    return this.http.get(this.safesUrl).pipe(map((safes: Safe[]) => safes));
  }

  addItem(item: SafeItem, safeId: string): Observable<SafeItem> {
    console.log(item, safeId, this.http);
    return this.http.post(this.safesUrl + `/${safeId}/items`, item).pipe(
      map((response: SafeItem) => response),
      tap(x => this.store.dispatch(new LoadSafeAfterUserAddItem()))
    );
  }

  getItems(safeId: string): Observable<SafeItem[]> {
    const result$ = this.http.get(this.safesUrl + `/${safeId}/items`).pipe(
      map((items: SafeItem[]) => items),
      tap((items: SafeItem[]) =>
        this.store.dispatch(new LoadSafeItems({ safeItems: items }))
      ),
      shareReplay(1)
    );
    return result$;
  }
}
```

</details>

- What is the current behavior in the store slice 'safeitem'?
- What is the expected behavior?

## 14.2 Use the safeitems in the safe.component.ts

- this.items$ = this.store.pipe(select(getSafeItems));

<details><summary>safe.component.ts Solution</summary>

```typescript
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import {
  switchMap,
  map,
  withLatestFrom,
  switchMapTo,
  tap
} from "rxjs/operators";
import { Observable, merge, Subject } from "rxjs";
import { Safe, SafeItem } from "~core/model";
import { SafeService, FileService } from "~core/services";
import { AddSafeItemDialogComponent } from "../add-safe-item-dialog";
import { MatDialog } from "@angular/material";
import { select, Store } from "@ngrx/store";
import { State } from "app/root-store/state";
import { selectItemsBySafeId } from "~shared/store/safe/selectors/safeitem.selector";
import { LoadSafeItems } from "~shared/store/safe/actions/safe-item.actions";

@Component({
  selector: "cool-safe",
  templateUrl: "./safe.component.html",
  styleUrls: ["./safe.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SafeComponent implements OnInit {
  showAddButton$: Observable<boolean>;
  safe$: Observable<Safe>;
  items$: Observable<SafeItem[]>;
  trigger$: Subject<any> = new Subject<any>();

  constructor(
    private fileService: FileService,
    private activatedRoute: ActivatedRoute,
    private service: SafeService,
    private store: Store<State>,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    // Changed in Exercise 9.4.1
    // this.safe$ = this.activatedRoute.paramMap.pipe(switchMap((params: ParamMap) => this.service.getSafe(params.get('id'))));
    this.safe$ = this.activatedRoute.data.pipe(
      map((data: { safe: Safe }) => {
        return data.safe;
      })
    );

    this.showAddButton$ = this.activatedRoute.data.pipe(
      map((data: { showAddButton: boolean }) => {
        return data.showAddButton;
      })
    );

    // this.items$ = merge(this.safe$, this.trigger$).pipe(
    //   withLatestFrom(this.safe$),
    //   switchMap(([trigger, safe]: [any, Safe]) => this.service.getItems(safe.id))
    // );
    const itemsReloadEvent$ = merge(this.safe$, this.trigger$).pipe(
      withLatestFrom(this.safe$),
      tap(([trigger, safe]: [any, Safe]) =>
        this.store.dispatch(new LoadSafeItems({ safeId: safe.id }))
      )
    );
    itemsReloadEvent$.subscribe(() => console.log("items reload event"));
    this.items$ = this.store.pipe(select(selectItemsBySafeId));
  }

  openInvoice(id: string) {
    this.fileService
      .get(id)
      .then(image => {
        // console.log(image);
        const newTab = window.open();
        newTab.document.body.innerHTML = '<img src="' + image + '">';
      })
      .catch(err => console.error("invoice not found:", id, err));
  }

  onAddSafeItem(event) {
    const dialogRef = this.dialog.open(AddSafeItemDialogComponent, {
      // height: '800px',
      width: "600px",
      backdropClass: "logindialog-overlay",
      panelClass: "logindialog-panel"
    });
    dialogRef
      .afterClosed()
      .pipe(withLatestFrom(this.safe$))
      .subscribe(([result, safe]) => {
        if (!!result) {
          console.log(`Dialog result: ${result}`);
          const result$ = this.service.addItem(result, safe.id);
          result$.subscribe(this.trigger$);
        }
      });
  }
}
```

</details>

## 14.3 create selector to access SafeItems by Safe Id

- we need a selector to get SafeItems, when the safe changes and the Entities of the safeItem slice in the store changes.
- hint. create: SelectSafeItemMap, SafeItemsLoading, selectItemsBySafeId and reuse the "fromSafeList.selectSafeById" selector
- hint. move the adapter default selectors from the safeitem.reducer.ts to the safeitem.selector.ts

src/app/shared/store/safe/selectors/safeitem.selector.ts

```typescript
import * as fromSafeList from "./safe-list.selector";
import * as fromSafeItem from "../reducers/safe-item.reducer";
import * as fromSafe from "../state";
import { Safe, SafeItem } from "~core/model";
import { Dictionary } from "@ngrx/entity";
import { createSelector, createFeatureSelector } from "@ngrx/store";

export const selectSafeFeature = createFeatureSelector<fromSafe.State>("safe");
export const selectSafeItemFeature = createSelector(
  selectSafeFeature,
  (state: fromSafe.State) => state.safeItem
);
export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = fromSafeItem.adapter.getSelectors(selectSafeItemFeature);

export const SelectSafeItemMap = createSelector(
  selectSafeItemFeature,
  (state: fromSafeItem.State) => state.safeItemMap
);
export const SafeItemsLoading = createSelector(
  selectSafeItemFeature,
  (state: fromSafeItem.State) => state.loading
);

export const selectItemsBySafeId = createSelector(
  fromSafeList.selectSafeById,
  selectEntities,
  SelectSafeItemMap,
  (
    safe: Safe,
    entities: Dictionary<SafeItem>,
    itemMap: Dictionary<string>
  ): SafeItem[] => {
    // reference in safe
    // return safe.items.map(id => entities[id]);
    // reference in items
    // const filtered2 = Object.keys(entities).reduce(function(filtered, key) {
    //   if (entities[key].safeId === safe.id) {
    //     filtered = [...filtered, entities[key]];
    //   }
    //   return filtered;
    // }, []);
    console.log("selectItemsBySafeId", entities, itemMap, safe.id);
    const itemKeys: string[] = Object.keys(itemMap).filter(
      key => itemMap[key] === safe.id
    );
    return itemKeys.map(key => entities[key]);
  }
);
```

### State after this exercise:

- when going to the safe detail page, there are no safeitems yet, but you should see the following events:

![Redux](screenshots/reduxtools-ex2.jpg)

- That the selector for to get the safe items works and is triggered when the safe id route is used to the safe detail page, when can see in the console:

![Redux](screenshots/console-ex2.jpg)

## 14.4 update shared/store/safe/reducers/safe-item.reducer.ts

- Add aditional State to SafeItem

```typescript
export interface State extends EntityState<SafeItem> {
  // additional entities state properties
  safeItemMap: Dictionary<string>;
  loading: boolean;
}
```

- change LoadSafeItems so it sets the loading state to true

```typescript
case SafeItemActionTypes.LoadSafeItems: {
    return { ...state, loading: true };
    // return adapter.addAll(action.payload.safeItems, state);
}
```

- change AddSafeItem to safe-item.reducer.ts, so that it adds new safeItems keys to the map safeItemMap contains [safeItemId]=safeId

```typescript
 case SafeItemActionTypes.AddSafeItems: {
      const updatedMap = {
        ...state.safeItemMap,
        ...action.payload.safeItems.reduce(function(filtered, item: SafeItem) {
          filtered[item.id] = action.payload.safeId;
          return filtered;
        }, {})
      };
      const updatedState: State = { ...state, safeItemMap: updatedMap, loading: false } as State;
      return adapter.addMany(action.payload.safeItems, updatedState);
    }
```
