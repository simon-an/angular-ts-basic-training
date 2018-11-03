import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { switchMap, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { LoginData, User } from '~core/model';
import { AuthService } from '~core/services';

@Component({
  selector: 'cool-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  dialogRef: MatDialogRef<LoginDialogComponent>;

  config: MatDialogConfig = {
    disableClose: false,
    hasBackdrop: true,
    backdropClass: '',
    width: '',
    height: '',
    position: {
      top: '',
      bottom: '',
      left: '',
      right: ''
    },
    data: {
      message: '',
      role: of('user')
    }
  };

  loading = false;

  constructor(
    private auth: AuthService,
    public dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.config.data.role = this.activatedRoute.paramMap.pipe(map((params: ParamMap) => params.get('role')));
    this.openModal();
  }

  ngOnInit() {}

  openModal() {
    this.dialogRef = this.dialog.open(LoginDialogComponent, this.config);
    this.dialogRef
      .afterClosed()
      .pipe(
        tap(() => (this.loading = true)),
        switchMap((loginData: LoginData) => {
          console.log('data', loginData);
          return this.auth.login(loginData);
        })
      )
      .subscribe((user: User | null) => {
        this.loading = false;
        console.log('user', user);
        this.dialogRef = null;
        if (user) {
          if (user.role) {
            this.router.navigate(['/' + user.role]);
          } else {
            this.router.navigate(['/user']);
          }
        } else {
          this.config.data.message = 'Unauthorized';
          this.openModal();
        }
      });
  }
}
