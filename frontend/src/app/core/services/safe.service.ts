import { Injectable } from '@angular/core';
import { Safe, SafeItem } from '../model';
import { Observable, Subject, BehaviorSubject, timer, interval } from 'rxjs';
import { map, switchMap, switchMapTo, tap, concatMapTo, take, startWith } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class SafeService {
  private readonly safesUrl = '/api/safes';
  private readonly itemsUrl = '/api/items';

  // private currentSafe: Subject<Safe> = new Subject<Safe>();
  private safes: BehaviorSubject<Safe[]> = new BehaviorSubject<Safe[]>([]);
  private items: BehaviorSubject<SafeItem[]> = new BehaviorSubject<SafeItem[]>([]);

  constructor(private http: HttpClient) {
    // this.safes.next([
    //   { id: '1', value: 999, itemSize: 2, active: true, activeSince: new Date() },
    //   { id: '2', value: 123, itemSize: 3, active: true, activeSince: new Date() }
    // ] as Safe[]);

    interval(5000)
      .pipe(
        startWith(0),
        concatMapTo(this.loadSafes())
        // take(1)
      )
      .subscribe(this.safes);
  }

  getSafe(safeId: string): Observable<Safe> {
    return this.safes.asObservable().pipe(map(safes1 => safes1.find(safe => safe.id === safeId)));
  }

  loadSafes(): Observable<Safe[]> {
    return this.http.get(this.safesUrl).pipe(
      map((safes: Safe[]) => safes),
      tap(safes => console.log(safes))
    );
  }

  getSafes(): Observable<Safe[]> {
    return this.safes.asObservable();
  }

  addItem(item: SafeItem): any {
    const newItems = [...this.items.getValue(), item];
    this.items.next(newItems);
  }

  getItems(safeId: string): Observable<SafeItem[]> {
    return this.http.get(this.safesUrl + `/${safeId}/items`).pipe(map((items: SafeItem[]) => items));
  }
}
