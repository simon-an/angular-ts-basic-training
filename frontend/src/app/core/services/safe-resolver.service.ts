import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';

import { Safe } from '../model';
import { SafeService } from './safe.service';

@Injectable({
  providedIn: 'root',
})
export class SafeResolverService implements Resolve<Safe> {
  constructor(private safeService: SafeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Safe> | Observable<never> {
    const id = route.paramMap.get('id');

    return this.safeService.getSafe(id).pipe(
      take(1),
      mergeMap(safe => {
        if (safe) {
          return of(safe);
        } else {
          // id not found
          this.router.navigate(['home']);
          return EMPTY;
        }
      })
    );
  }
}
