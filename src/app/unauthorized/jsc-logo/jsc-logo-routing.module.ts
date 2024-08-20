import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JscLogoPage } from './jsc-logo.page';

const routes: Routes = [
  {
    path: '',
    component: JscLogoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JscLogoPageRoutingModule {}
