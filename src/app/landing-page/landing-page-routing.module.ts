import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LandingPagePage } from './landing-page.page';
import { LoginPage } from '../unauthorized/login/login.page';

const routes: Routes = [
  {
    path: '',
    component: LandingPagePage
  },
  {
    path: 'unauthorized/login',
    component: LoginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandingPagePageRoutingModule { }
