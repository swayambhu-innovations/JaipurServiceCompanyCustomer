import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectSlotPage } from './select-slot.page';

const routes: Routes = [
  {
    path: '',
    component: SelectSlotPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectSlotPageRoutingModule {}
