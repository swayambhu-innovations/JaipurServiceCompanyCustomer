import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NoInternetComponent } from './no-internet.component';

const routes: Routes = [
  {
    path: '',
    component: NoInternetComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NoInternetRoutingModule {}
