import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map, tap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    console.log('canactivate', state, next);
    return this.verifyUser();
  }

  canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    console.log('canLoad', route);
    return this.verifyUser();
  }

  verifyUser(): Observable<boolean> {
    return this.auth.getUser().pipe(
      map(Boolean),
      tap(canload => {
        if (!canload) {
          console.log('error. goback to home.');
          this.router.navigate(['/home']);
        }
      }),
      take(1)
    );
  }
}
