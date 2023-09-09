import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NoNotificationPage } from './no-notification.page';

const routes: Routes = [
  {
    path: '',
    component: NoNotificationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NoNotificationPageRoutingModule {}
