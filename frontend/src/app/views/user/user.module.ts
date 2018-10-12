import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user/user.component';
import { SharedModule } from '../../shared/shared.module';
import { MatListModule } from '@angular/material';

@NgModule({
  imports: [CommonModule, SharedModule, UserRoutingModule, MatListModule],
  declarations: [UserComponent]
})
export class UserModule { }
