import { Component } from '@angular/core';
import { AuthService } from './core';
import { Router } from '@angular/router';

@Component({
  selector: 'cool-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';

  constructor(auth: AuthService, router: Router) {
    if (localStorage.getItem('TOKEN')) {
      auth.validateToken().subscribe(
        user => {
          if (user) {
            router.navigate(['/' + user.role]);
          } else {
            router.navigate(['/home']);
          }
        },
        error => {
          localStorage.removeItem('TOKEN');
          router.navigate(['/home']);
        },
        () => {
          localStorage.removeItem('TOKEN');
          router.navigate(['/home']);
        }
      );
    }
  }
}
