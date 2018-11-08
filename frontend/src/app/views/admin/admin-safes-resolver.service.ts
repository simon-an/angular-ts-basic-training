import { Safe } from '~core/model';
import { SafeService } from '~core/services';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminSafesResolverService implements Resolve<Safe[]> {
  constructor(private safeService: SafeService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.safeService.getSafes();
  }
}
