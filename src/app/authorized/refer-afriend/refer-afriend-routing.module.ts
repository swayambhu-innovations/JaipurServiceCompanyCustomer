import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReferAfriendPage } from './refer-afriend.page';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

const routes: Routes = [
  {
    path: '',
    component: ReferAfriendPage
  }
];

@NgModule({
  providers: [SocialSharing],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReferAfriendPageRoutingModule {}
