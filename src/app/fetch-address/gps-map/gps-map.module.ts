import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GpsMapPageRoutingModule } from './gps-map-routing.module';
import { GoogleMapsModule } from '@angular/google-maps';

import { GpsMapPage } from './gps-map.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GpsMapPageRoutingModule,
    GoogleMapsModule,
  ],
  declarations: [GpsMapPage],
})
export class GpsMapPageModule {}
