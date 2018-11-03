import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from '~shared/container';

const routes: Routes = [
  {
    path: 'index',
    component: HomeComponent,
    children: [
      {
        path: 'login/:role',
        component: LoginComponent
      }
    ]
  },
  {
    path: '',
    redirectTo: 'index'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
