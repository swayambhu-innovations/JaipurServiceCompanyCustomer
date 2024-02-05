import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CartPageRoutingModule } from './cart-routing.module';

import { CartPage } from './cart.page';
import { OffersComponent } from './offers/offers.component';
import { WidgetsModule } from 'src/app/widgets/widgets.module';
import { WebModalModule } from '../web-modals/web-modals.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CartPageRoutingModule,
    WidgetsModule,
    WebModalModule,
  ],
  declarations: [CartPage, OffersComponent],
})
export class CartPageModule {}
