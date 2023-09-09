import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmBookingPageRoutingModule } from './confirm-booking-routing.module';

import { ConfirmBookingPage } from './confirm-booking.page';
import { WidgetsModule } from '../../widgets/widgets.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmBookingPageRoutingModule,
    WidgetsModule
  ],
  declarations: [ConfirmBookingPage]
})
export class ConfirmBookingPageModule {}
