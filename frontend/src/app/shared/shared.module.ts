import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '@angular/cdk/layout';
import {
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatInputModule,
  MatSelectModule,
  MatRadioModule,
  MatCardModule,
  MatDialogModule,
  MatFormFieldModule,
  MatProgressSpinnerModule,
} from '@angular/material';
import { RouterModule } from '@angular/router';
import { HeaderWithSidenavComponent } from './components/header-with-sidenav/header-with-sidenav.component';
import { AddSafeItemDialogComponent } from './container/add-safe-item-dialog/add-safe-item-dialog.component';
import { SafeItemFormComponent } from './components/safe-item-form/safe-item-form.component';
import { FormsModule } from '@angular/forms';
import { LoginDialogComponent } from './container/login-dialog/login-dialog.component';
import { LoginComponent } from './container/login/login.component';

@NgModule({
  imports: [
    CommonModule,
    LayoutModule,
    RouterModule,
    FormsModule,
    MatFormFieldModule,
    MatDialogModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  declarations: [HeaderWithSidenavComponent, AddSafeItemDialogComponent, SafeItemFormComponent, LoginDialogComponent, LoginComponent],
  exports: [
    HeaderWithSidenavComponent,
    AddSafeItemDialogComponent,
    SafeItemFormComponent,
    MatFormFieldModule,
    MatDialogModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    LoginDialogComponent,
    LoginComponent,
    MatProgressSpinnerModule,
  ],
  entryComponents: [AddSafeItemDialogComponent, LoginDialogComponent],
})
export class SharedModule {}
