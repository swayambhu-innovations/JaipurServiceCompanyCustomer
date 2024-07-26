import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocationDisabledPageRoutingModule } from './location-disabled-routing.module';

import { LocationDisabledPage } from './location-disabled.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocationDisabledPageRoutingModule
  ],
  declarations: [LocationDisabledPage]
})
export class LocationDisabledPageModule {}
