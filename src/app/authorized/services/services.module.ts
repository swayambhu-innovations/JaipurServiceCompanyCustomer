import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServicesPageRoutingModule } from './services-routing.module';

import { ServicesPage } from './services.page';
import { CartPopuPageModule } from '../cart-popu/cart-popu.module';
import { WidgetsModule } from 'src/app/widgets/widgets.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServicesPageRoutingModule,
    CartPopuPageModule,
    WidgetsModule
  ],
  declarations: [ServicesPage]
})
export class ServicesPageModule {}
