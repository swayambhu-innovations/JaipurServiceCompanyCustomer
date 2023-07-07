import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmptyCartPage } from './empty-cart.page';

const routes: Routes = [
  {
    path: '',
    component: EmptyCartPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmptyCartPageRoutingModule {}
