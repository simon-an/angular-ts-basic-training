import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin/admin.component';
import { SharedModule } from '../../shared/shared.module';
import { MatListModule } from '@angular/material';

@NgModule({
  imports: [CommonModule, SharedModule, MatListModule, AdminRoutingModule],
  declarations: [AdminComponent]
})
export class AdminModule { }
