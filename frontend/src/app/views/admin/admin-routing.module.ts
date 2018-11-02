import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { SafeResolverService } from '~core/*';
import { SafeComponent, SafeListComponent } from '~shared/*';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: '',
        component: SafeListComponent,
        outlet: 'admin1'
      },
      {
        path: 'safe/:id',
        component: SafeComponent,
        outlet: 'secondary',
        resolve: {
          safe: SafeResolverService
        }
      }
    ]
  },
  {
    path: '',
    redirectTo: 'admin'
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
