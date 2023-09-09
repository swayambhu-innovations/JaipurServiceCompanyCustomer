import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectPaymentMethodPageRoutingModule } from './select-payment-method-routing.module';

import { SelectPaymentMethodPage } from './select-payment-method.page';
import { WidgetsModule } from '../../widgets/widgets.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectPaymentMethodPageRoutingModule,
    WidgetsModule
  ],
  declarations: [SelectPaymentMethodPage]
})
export class SelectPaymentMethodPageModule {}
