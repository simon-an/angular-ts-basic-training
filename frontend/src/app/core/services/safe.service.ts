import { Injectable } from '@angular/core';
import { Safe, SafeItem } from '../model';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SafeService {

  // private currentSafe: Subject<Safe> = new Subject<Safe>();
  private safes: Subject<Safe[]> = new BehaviorSubject<Safe[]>([]);
  private items: Subject<SafeItem[]> = new BehaviorSubject<SafeItem[]>([]);

  getSafe(safeId: string): Observable<Safe> {
    return this.safes.asObservable().pipe(
      map(safes1 =>
        safes1.find(safe => safe.id === safeId)
      )
    );
  }

  getSafes(): Observable<Safe[]> {
    return this.safes.asObservable();
  }

  getItems(safeId: string): Observable<SafeItem[]> {
    this.items.next(null);
    setTimeout(
      () => {
        if (safeId === '1') {
          this.items.next([
            { id: '1', name: 'Fahrrad' },
            { id: '2', name: 'Laptop' }
          ] as SafeItem[]);
        } else
          if (safeId === '2') {
            this.items.next([
              { id: '3', name: 'Taschenrechner' },
              { id: '4', name: 'Sonnenbrille' },
              { id: '5', name: 'Brille' }
            ] as SafeItem[]);
          }
      },
      2000
    );
    return this.items.asObservable();
  }

  constructor() {
    this.safes.next([
      { id: '1', value: 999, itemSize: 2, active: true, activeSince: new Date() },
      { id: '2', value: 123, itemSize: 3, active: true, activeSince: new Date(), }
    ] as Safe[]);
  }
}
