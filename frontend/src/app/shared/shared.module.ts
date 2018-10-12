import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { HeaderWithSidenavComponent } from './components/header-with-sidenav/header-with-sidenav.component';

@NgModule({
  imports: [
    CommonModule,
    LayoutModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule
  ],
  declarations: [HeaderWithSidenavComponent],
  exports: [HeaderWithSidenavComponent]
})
export class SharedModule {}
