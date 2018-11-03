import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { MatProgressSpinnerModule, MatDialogModule, MatSelectModule, MatInputModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LoginDialogComponent } from '../login-dialog';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

const TEST_DIRECTIVES = [LoginDialogComponent];

@NgModule({
  imports: [
    TranslateModule,
    FormsModule,
    MatSelectModule,
    MatInputModule,
    HttpClientTestingModule,
    MatDialogModule,
    NoopAnimationsModule
  ],
  exports: TEST_DIRECTIVES,
  declarations: TEST_DIRECTIVES,
  entryComponents: [LoginDialogComponent]
})
class DialogTestModule {}

describe('LoginComponent', () => {
  // let component: LoginComponent;
  // let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        DialogTestModule,
        MatProgressSpinnerModule,
        HttpClientTestingModule,
        MatDialogModule,
        RouterTestingModule,
        NoopAnimationsModule
      ],
      declarations: [LoginComponent]
    }).compileComponents();
  }));

  // beforeEach(() => {
  //   fixture = TestBed.createComponent(LoginComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  // });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  //   component.loading = true;
  // });
});
