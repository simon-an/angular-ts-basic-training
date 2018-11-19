import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user/user.component';
import { UserHomeComponent } from './container/userhome/userhome.component';
import { SafeComponent } from '~shared/container/safe';
import { SafeResolverService } from '~core/services';

const routes: Routes = [
  {
    path: 'home',
    component: UserComponent,
    children: [
      {
        path: 'safe/:id',
        component: SafeComponent,
        outlet: 'secondary',
        data: { showAddButton: true },
        resolve: {
          safe: SafeResolverService
        }
      },
      {
        path: '',
        component: UserHomeComponent,
        outlet: 'secondary'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'home'
  },
  {
    path: 'safe/:id',
    component: SafeComponent,
    data: { showAddButton: true },
    resolve: {
      safe: SafeResolverService
    }
  },
  {
    path: 'safes',
    component: UserHomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
