import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReferAfriendPage } from './refer-afriend.page';

const routes: Routes = [
  {
    path: '',
    component: ReferAfriendPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReferAfriendPageRoutingModule {}
