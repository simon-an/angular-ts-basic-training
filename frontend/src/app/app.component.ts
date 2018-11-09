import { Component } from '@angular/core';
import { AuthService } from './core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'cool-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Cool Safe';

  constructor(auth: AuthService, router: Router, translate: TranslateService) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('de');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('de');

    if (localStorage.getItem('TOKEN')) {
      auth.validateToken().subscribe(
        user => {
          if (user) {
            router.navigate(['/' + user.role]);
          } else {
            localStorage.removeItem('TOKEN');
            router.navigate(['/home']);
          }
        },
        error => {
          console.log('error');
          localStorage.removeItem('TOKEN');
          router.navigate(['/home']);
        }
      );
    } else {
      router.navigate(['/home']);
    }
  }
}
