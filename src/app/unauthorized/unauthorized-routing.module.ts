import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UnauthorizedPage } from './unauthorized.page';

const routes: Routes = [
  {
    path: '',
    component: UnauthorizedPage
  },
  {
    path:'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path:'otp',
    loadChildren: () => import('./otp/otp.module').then( m => m.OtpPageModule)
  },  {
    path: 'jsc-logo',
    loadChildren: () => import('./jsc-logo/jsc-logo.module').then( m => m.JscLogoPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UnauthorizedPageRoutingModule {}
