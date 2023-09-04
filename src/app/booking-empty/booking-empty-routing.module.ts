import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BookingEmptyPage } from './booking-empty.page';

const routes: Routes = [
  {
    path: '',
    component: BookingEmptyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookingEmptyPageRoutingModule {}
