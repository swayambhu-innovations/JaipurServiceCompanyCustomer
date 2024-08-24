import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FetchAddressPage } from './fetch-address.page';

const routes: Routes = [
  {
    path: '',
    component: FetchAddressPage
  },
  {
    path: 'gps-map',
    loadChildren: () => import('./gps-map/gps-map.module').then( m => m.GpsMapPageModule)
  },
  {
    path: 'location-disabled',
    loadChildren: () => import('./location-disabled/location-disabled.module').then( m => m.LocationDisabledPageModule)
  },
  {
    path: 'search-loc',
    loadChildren: () => import('./search-loc/search-loc.module').then( m => m.SearchLocPageModule)
  },  {
    path: 'update-app',
    loadChildren: () => import('./update-app/update-app.module').then( m => m.UpdateAppPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FetchAddressPageRoutingModule {}
