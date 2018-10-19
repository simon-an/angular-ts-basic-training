import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user/user.component';
import { SharedModule } from '../../shared/shared.module';
import { MatListModule, MatButtonModule, MatIconModule } from '@angular/material';
import { ItemListComponent } from './components/item-list/item-list.component';
import { SafeComponent } from './containers/safe/safe.component';
import { UserHomeComponent } from './components/userhome/userhome.component';

@NgModule({
  imports: [CommonModule, SharedModule, UserRoutingModule, MatIconModule, MatButtonModule, MatListModule],
  declarations: [UserComponent, ItemListComponent, SafeComponent, UserHomeComponent]
})
export class UserModule { }
