import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GpsMapPage } from './gps-map.page';

const routes: Routes = [
  {
    path: '',
    component: GpsMapPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GpsMapPageRoutingModule {}
