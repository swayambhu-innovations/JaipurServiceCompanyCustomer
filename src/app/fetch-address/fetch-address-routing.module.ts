import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FetchAddressPage } from './fetch-address.page';

const routes: Routes = [
  {
    path: '',
    component: FetchAddressPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FetchAddressPageRoutingModule {}
