# Chapter 11

## Preparation for calling the backend

### Create a LoggerService in core/services/logger.service.ts

```typescript
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class LoggerService {
  static log(msg: string): void {
    console.log(msg);
  }

  static error(msg: string, obj = {}): void {
    console.error(msg, obj);
  }

  static warn(msg: string, obj = {}): void {
    console.warn(msg, obj);
  }
}
```

### Variant NodeJS Backend

- add to package json:

```json
   "start:with:backend": "ng serve --configuration=production --proxy-config local-proxy.conf.json",
```

-add file: local-proxy.conf.json to project root folder

```json
{
  "/api": {
    "target": "http://localhost:3000/",
    "secure": false,
    "ws": false,
    "pathRewrite": {
      "/api": "/"
    }
  }
}
```

- start the backend

```bash
npm i && npm start
```

- start the frontend with:

```bash
npm run start:with:backend
```

- import integrationtests/basic-training.postman_collection.json into postman

### Variant Postman Mock: TODO

### Variant In Memory Mock

```bash
npm install in-memory-web-api
```

- create core/services/in-memory-safe.service.ts

<details><summary>in-memory-safe.service.ts</summary>

```typescript
import { Injectable } from "@angular/core";
import {
  InMemoryDbService,
  RequestInfo,
  RequestInfoUtilities,
  ParsedRequestUrl,
  STATUS,
  getStatusText,
  ResponseOptions
} from "angular-in-memory-web-api";
import { delay } from "rxjs/operators";
import { of, Observable } from "rxjs";
import { Safe } from "~core/model";

interface DB {
  [collectionName: string]: any[];
}

type ReturnType = "observable" | "promise" | "object";

// @Injectable({
//   providedIn: 'root',
// })
export class SafeInMemDataService implements InMemoryDbService {
  active = true;
  maxId = 1000;

  /** In-memory database data */
  db: DB;

  createDb(reqInfo?: RequestInfo) {
    // default returnType
    // let returnType = 'object';
    const returnType: ReturnType = "observable" || "promise";
    // let returnType  = 'promise';

    console.log("Creating Safe Mock Data service");

    if (!this.db) {
      const items = [
        { safeId: "1", id: "1", name: "Fahrrad", price: 55.5 },
        { safeId: "1", id: "2", name: "Laptop", price: 999.99 },
        { safeId: "2", id: "3", name: "Taschenrechner", price: 123.5 },
        { safeId: "2", id: "4", name: "Sonnenbrille", price: 345 },
        { safeId: "2", id: "5", name: "Brille", price: 567 }
      ];

      const safes = [
        {
          id: "1",
          value: 999,
          itemSize: 2,
          users: ["111"],
          items: ["1", "2"],
          active: true,
          activeSince: new Date(1999, 1, 1)
        },
        {
          id: "2",
          value: 123,
          itemSize: 3,
          items: ["3", "4", "5"],
          users: ["17", "19", "25"],
          active: true,
          activeSince: new Date(2018, 12, 30)
        }
      ];

      if (reqInfo) {
        const body = reqInfo.utils.getJsonBody(reqInfo.req) || {};
        if (body.clear === true) {
          safes.length = 0;
          items.length = 0;
          // for (const coll in this.db) {
          //   this.db[coll].length = 0;
          // }
        }
        this.active = !!body.active;
        // 'returnType` can be 'object' | 'observable' | 'promise'
        // returnType = body.returnType || 'object';
      }
      this.db = { safes, items };
    }

    switch (returnType) {
      case "observable":
        return of(this.db).pipe(delay(10));
      case "promise":
        return new Promise(resolve => {
          setTimeout(() => resolve(this.db), 10);
        });
      default:
        return this.db;
    }
  }

  /**
   * Simulate generating new Id on the server
   * All collections in this db have numeric ids.
   * Seed grows by highest id seen in any of the collections.
   */
  genId(collection: { id: number }[], collectionName: string) {
    this.maxId =
      1 +
      collection.reduce((prev, cur) => Math.max(prev, cur.id || 0), this.maxId);
    return this.maxId;
  }

  /**
   * Override `parseRequestUrl`
   * Manipulates the request URL or the parsed result.
   * If in-mem is inactive, clear collectionName so that service passes request thru.
   * If in-mem is active, after parsing with the default parser,
   * @param url from request URL
   * @param utils for manipulating parsed URL
   */
  parseRequestUrl(url: string, utils: RequestInfoUtilities): ParsedRequestUrl {
    // const newUrl = url.replace('/books/search/', '/books/?title=');
    const parsed: ParsedRequestUrl = utils.parseRequestUrl(url);
    // console.log('request:', parsed, url);

    if (/\/items(\/)?$/.test(url)) {
      const match: RegExpExecArray = /\/safes\/([0-9]*)\/items(\/)?$/.exec(url);
      parsed.collectionName = "items";
      parsed.id = "";
      parsed.query = new Map().set("safeId", [match[1]]);
      // parsed.resourceUrl = 'api/items';
    }

    const isDefaultRoot = parsed.apiBase === "api/";
    parsed.collectionName =
      this.active && isDefaultRoot
        ? mapCollectionName(parsed.collectionName)
        : undefined;
    return parsed;
  }
}

/**
 * Remap a known singular collection name ("hero")
 * to the plural collection name ("heroes"); else return the name
 * @param name - collection name from the parsed URL
 */
function mapCollectionName(name: string): string {
  return ({ safe: "safes", item: "items" } as any)[name] || name;
}
```

</details>

- update core.module.ts

```typescript
  // ...
import { environment } from 'environments/environment';
import { HttpClientInMemoryWebApiModule, InMemoryDbService } from 'angular-in-memory-web-api';
import { SafeInMemDataService } from './services/in-memory-safe.service';
  // ...
 imports: [
    // ...
 environment.production
      ? []
      : HttpClientInMemoryWebApiModule.forRoot(SafeInMemDataService, {
          delay: 500,
          dataEncapsulation: false,
          passThruUnknownUrl: true,
        }),
  ],
  providers: [
     { provide: SafeInMemDataService, useExisting: InMemoryDbService }],
```

## Exercise 11.1 HTTP Interceptors

### Implement an intercepter which logs the duration of every http request

- create file core/interceptors/timing.interceptors.ts
- hint: TimingInterceptor implements HttpInterceptor
- hint: add as a provider to HTTP_INTERCEPTORS in core module

<details>
<summary>
Solution timing.interceptors.ts
</summary>

```typescript
import { tap } from "rxjs/operators";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from "@angular/common/http";
import { Observable } from "rxjs";
import { LoggerService } from "../services/logger.service";

export class TimingInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const started = Date.now();
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          const elapsed = Date.now() - started;
          LoggerService.log(
            `Request for ${req.urlWithParams} took ${elapsed} ms.`
          );
        }
      })
    );
  }
}
```

</details>

## Exercise 11.2 Call the backend in safe.service

### safe.service should now call the endpoints

- GET safes
- GET safes/:id/items
- POST safes/:id/items

- methods still are: getSafe(safeId), getSafes, addItem, getItems(safeId)

<details>
<summary>safe.service.ts</summary>

```typescript
import { Injectable } from "@angular/core";
import { Safe, SafeItem } from "../model";
import {
  Observable,
  timer,
  ReplaySubject,
  BehaviorSubject,
  Subject
} from "rxjs";
import {
  map,
  tap,
  concatMapTo,
  take,
  shareReplay,
  filter
} from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class SafeService {
  private readonly safesUrl = "/api/safes";

  private safes: ReplaySubject<Safe[]> = new ReplaySubject<Safe[]>();
  private items: Subject<SafeItem[]> = new Subject<SafeItem[]>();

  constructor(private http: HttpClient) {
    timer(1000)
      .pipe(concatMapTo(this.loadSafes()))
      .subscribe(this.safes);
  }

  getSafe(safeId: string): Observable<Safe> {
    return this.safes.asObservable().pipe(
      map(safes1 => safes1.find(safe => safe.id === safeId)),
      filter(Boolean)
    );
  }

  loadSafes(): Observable<Safe[]> {
    return this.http.get(this.safesUrl).pipe(map((safes: Safe[]) => safes));
  }

  getSafes(): Observable<Safe[]> {
    return this.safes
      .asObservable()
      .pipe(tap(safes => console.log("get", safes)));
  }

  addItem(safeId: string, item: SafeItem): Observable<SafeItem> {
    const obs = this.http.post(this.safesUrl + `/${safeId}/items`, item).pipe(
      map((response: SafeItem) => response),
      shareReplay(1)
    );

    return obs;
  }

  getItems(safeId: string): Observable<SafeItem[]> {
    const result$ = this.http
      .get(this.safesUrl + `/${safeId}/items`)
      .pipe(map((items: SafeItem[]) => items));
    result$.subscribe(items => {
      // console.log('items loaded ....', items);
      this.items.next(items);
    });
    return result$;
  }
}
```

</details>

### Add Spinner to safe-page.component

- Hint: make sure, that when the safeService.addItem call is finished, there will be an update to the item list.
- Hint: you might need two Subjects in the component, to handle the loading and the shouldLoad/trigger state.

```html
    <mat-toolbar>
      <!-- ... -->
      <mat-spinner [diameter]="40" *ngIf="(loading$ | async)"></mat-spinner>
    </mat-toolbar>
```

<details>
<summary>
Solution safe-page.component.ts
</summary>

```typescript
import { Observable, merge, Subject, BehaviorSubject } from "rxjs";
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from "@angular/core";
import { SafeService } from "~core/services";
import { SafeItem, Safe } from "~core/model";
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

@Component({
  templateUrl: "./safe-page.component.html",
  styleUrls: ["./safe-page.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SafePageComponent implements OnInit {
  safe$: Observable<Safe>;
  items$: Observable<SafeItem[]>;
  trigger$: Subject<any> = new Subject<any>();
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isCustomer = true; // TODO provide through dependency injection

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: SafeService,
    private dialogService: MatDialog
  ) {}

  ngOnInit() {
    this.safe$ = this.activatedRoute.paramMap.pipe(
      switchMap((params: ParamMap) => this.service.getSafe(params.get("id")))
    );
    const fire$ = merge(this.safe$, this.trigger$);
    fire$.subscribe(() => {
      this.loading$.next(true);
    });

    this.items$ = fire$.pipe(
      withLatestFrom(this.safe$),
      switchMap(([trigger, safe]: [any, Safe]) =>
        this.service.getItems(safe.id)
      )
    );

    this.items$.subscribe(() => {
      this.loading$.next(false);
    });
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
            this.trigger$.next(item.id);
          });
        }
      });
  }
}
```

</details>

[Next](chapter12.md)
