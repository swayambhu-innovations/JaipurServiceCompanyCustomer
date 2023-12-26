import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectAddressPageRoutingModule } from './select-address-routing.module';

import { SelectAddressPage } from './select-address.page';
import { WidgetsModule } from 'src/app/widgets/widgets.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectAddressPageRoutingModule,
    WidgetsModule
  ],
  declarations: [SelectAddressPage]
})
export class SelectAddressPageModule {}
