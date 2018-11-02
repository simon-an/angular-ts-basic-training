import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user/user.component';
import { SharedModule } from '../../shared/shared.module';
import { MatListModule, MatButtonModule, MatIconModule } from '@angular/material';
import { UserHomeComponent } from './components/userhome/userhome.component';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule,
    // TranslateModule.forChild({
    //   loader: {
    //     provide: TranslateLoader,
    //     useFactory: createTranslateLoader,
    //     deps: [HttpClient]
    //   }
    // }),
    UserRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatListModule
  ],
  declarations: [UserComponent, UserHomeComponent]
})
export class UserModule {}
