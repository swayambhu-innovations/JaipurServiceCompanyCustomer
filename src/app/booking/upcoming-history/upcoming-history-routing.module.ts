import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpcomingHistoryPage } from './upcoming-history.page';

const routes: Routes = [
  {
    path: '',
    component: UpcomingHistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpcomingHistoryPageRoutingModule {}
