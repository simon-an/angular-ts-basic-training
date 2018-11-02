import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user/user.component';
import { UserHomeComponent } from './components/userhome/userhome.component';
import { SafeComponent } from '~shared/*';
import { SafeResolverService } from '~core/*';

const routes: Routes = [
  {
    path: 'home',
    component: UserComponent,
    children: [
      {
        path: 'safe/:id',
        component: SafeComponent,
        outlet: 'secondary',
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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
