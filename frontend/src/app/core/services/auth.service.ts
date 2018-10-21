import { Injectable } from '@angular/core';
import { Observable, timer, of, BehaviorSubject } from 'rxjs';
import { LoginData, User } from '../model';
import { map, tap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  constructor() {}

  login(loginData: LoginData): Observable<User | null> {
    if (loginData) {
      return timer(30).pipe(
        map(time => {
          if (loginData.email === 'simon.potzernheim@metafinanz.de') {
            return { id: '1', name: 'simon.potzernheim@metafinanz.de', role: loginData.role } as User;
          }
          if (loginData.email.includes('@gmail.com')) {
            return { id: '2', name: loginData.email, role: 'user' } as User;
          }
          return null;
        }),
        tap((loginAsUser: User) => this.user.next(loginAsUser))
      );
    }
    return of(null);
  }

  getUser() {
    return this.user.asObservable();
  }

  emailExists(email: string): Promise<boolean> {
    return timer(300)
      .pipe(
        map(time => {
          if (email === 'simon.potzernheim@metafinanz.de' || email.includes('@gmail.com')) {
            return true;
          } else {
            return false;
          }
        })
      )
      .toPromise();
  }

  emailExistsRxjs(email: string): Observable<boolean> {
    return timer(300).pipe(
      map(time => {
        if (email === 'simon.potzernheim@metafinanz.de' || email.includes('@gmail.com')) {
          return true;
        } else {
          return false;
        }
      }),
      take(1)
    );
  }
}
