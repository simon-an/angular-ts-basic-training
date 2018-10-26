import { Injectable } from '@angular/core';
import { Safe, SafeItem } from '../model';
import { Observable, Subject, BehaviorSubject, timer, interval, ReplaySubject } from 'rxjs';
import { map, switchMap, switchMapTo, tap, concatMapTo, take, startWith, shareReplay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class SafeService {
  private readonly safesUrl = '/api/safes';
  private readonly itemsUrl = '/api/items';

  // private currentSafe: Subject<Safe> = new Subject<Safe>();
  private safes: ReplaySubject<Safe[]> = new ReplaySubject<Safe[]>();
  private items: ReplaySubject<SafeItem[]> = new ReplaySubject<SafeItem[]>();

  constructor(private http: HttpClient) {
    // this.safes.next([
    //   { id: '1', value: 999, itemSize: 2, active: true, activeSince: new Date() },
    //   { id: '2', value: 123, itemSize: 3, active: true, activeSince: new Date() }
    // ] as Safe[]);

    // interval(5000)
    timer(1000)
      .pipe(
        // startWith(0),
        concatMapTo(this.loadSafes())
        // take(1)
      )
      .subscribe(this.safes);
  }

  getSafe(safeId: string): Observable<Safe> {
    return this.safes.asObservable().pipe(map(safes1 => safes1.find(safe => safe.id === safeId)));
  }

  loadSafes(): Observable<Safe[]> {
    return this.http.get(this.safesUrl).pipe(map((safes: Safe[]) => safes));
  }

  getSafes(): Observable<Safe[]> {
    return this.safes.asObservable().pipe(tap(safes => console.log('get', safes)));
  }

  addItem(item: SafeItem, safeId: string): Observable<SafeItem> {
    console.log(item, safeId, this.http);
    // const newItems = [...this.items.getValue(), item];
    // this.items.next(newItems);
    return this.http.post(this.safesUrl + `/${safeId}/items`, item).pipe(
      map((response: SafeItem) => response),
      // tap(item => this.refreshItems(safeId)),
      tap(response => this.refreshItems2(response)),
      take(1)
    );
  }

  getItems(safeId: string): Observable<SafeItem[]> {
    const result$ = this.http.get(this.safesUrl + `/${safeId}/items`).pipe(
      map((items: SafeItem[]) => items),
      shareReplay(1)
    );
    result$.subscribe(this.items);
    return result$;
  }

  refreshItems(safeId: string) {
    this.getItems(safeId).subscribe(this.items);
  }
  refreshItems2(item: SafeItem) {
    this.items
      .pipe(
        map(i => [...i, item]),
        take(1)
      )
      .subscribe(this.items);

    this.loadSafes().subscribe(this.safes);
  }
}
