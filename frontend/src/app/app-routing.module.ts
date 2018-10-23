import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from './core/guards/admin.guard';
import { AuthGuard } from './core/guards/auth.guard';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: './views/admin/admin.module#AdminModule',
    canLoad: [AuthGuard, AdminGuard],
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'user',
    loadChildren: './views/user/user.module#UserModule',
    canLoad: [AuthGuard],
    canActivate: [AuthGuard]
  },
  {
    path: 'home',
    loadChildren: './views/home/home.module#HomeModule'
  },
  {
    path: '',
    // redirectTo: 'home',
    // resolve: { user: ResolveUserService },
    component: AppComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes
      // { enableTracing: true } // <-- debugging purposes only
    )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
