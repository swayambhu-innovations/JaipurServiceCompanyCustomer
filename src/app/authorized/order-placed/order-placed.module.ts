import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderPlacedPageRoutingModule } from './order-placed-routing.module';

import { OrderPlacedPage } from './order-placed.page';
import { WidgetsModule } from '../../widgets/widgets.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderPlacedPageRoutingModule,
    WidgetsModule
  ],
  declarations: [OrderPlacedPage]
})
export class OrderPlacedPageModule {}
