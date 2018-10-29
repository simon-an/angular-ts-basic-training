import { Injectable } from '@angular/core';
import { Observable, timer, of, BehaviorSubject } from 'rxjs';
import { LoginData, User } from '../model';
import { map, tap, take, catchError, concatMap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authUrl = 'api/login';

  user: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient) {}

  login(loginData: LoginData): Observable<User | null> {
    if (loginData) {
      return this.http.post(this.authUrl, loginData).pipe(
        map((res: any) => res.token),
        tap((token: string) => localStorage.setItem('TOKEN', 'Bearer ' + token)),
        tap((token: string) => console.log(token)),
        concatMap(token =>
          this.http.get(this.authUrl /*{ headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) }*/)
        ),
        tap((user: User) => this.user.next(user)),
        catchError(err => {
          console.log(err);
          return of(null);
        })
      );
    }
    return of(null);
  }

  validateToken(): Observable<User> {
    return this.http.get(this.authUrl /*{ headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) }*/).pipe(
      map((res: User) => res),
      tap((user: User) => this.user.next(user))
    );
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
