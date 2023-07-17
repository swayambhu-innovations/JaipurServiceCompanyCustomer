import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmptyCartPageRoutingModule } from './empty-cart-routing.module';

import { EmptyCartPage } from './empty-cart.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmptyCartPageRoutingModule
  ],
  declarations: [EmptyCartPage]
})
export class EmptyCartPageModule {}
