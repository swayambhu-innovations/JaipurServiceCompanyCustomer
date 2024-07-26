import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FetchAddressPageRoutingModule } from './fetch-address-routing.module';

import { FetchAddressPage } from './fetch-address.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FetchAddressPageRoutingModule
  ],
  declarations: [FetchAddressPage]
})
export class FetchAddressPageModule {}
