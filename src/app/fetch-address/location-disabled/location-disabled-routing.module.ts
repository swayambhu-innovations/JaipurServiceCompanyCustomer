import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocationDisabledPage } from './location-disabled.page';

const routes: Routes = [
  {
    path: '',
    component: LocationDisabledPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationDisabledPageRoutingModule {}
