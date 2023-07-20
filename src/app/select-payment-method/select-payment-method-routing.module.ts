import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectPaymentMethodPage } from './select-payment-method.page';

const routes: Routes = [
  {
    path: '',
    component: SelectPaymentMethodPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectPaymentMethodPageRoutingModule {}
