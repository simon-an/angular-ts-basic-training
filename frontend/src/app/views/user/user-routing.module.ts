import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user/user.component';
import { SafeComponent } from './containers/safe/safe.component';
import { UserHomeComponent } from './components/userhome/userhome.component';
import { SafeResolverService } from 'src/app/core';

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
          safe: SafeResolverService,
        },
      },
      {
        path: '',
        component: UserHomeComponent,
        outlet: 'secondary',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'home',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
