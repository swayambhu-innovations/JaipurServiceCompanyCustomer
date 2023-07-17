import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingRoutingModule } from './booking-routing.module';
import { BookingsComponent } from './components/bookings/bookings.component';
import { BookingComponent } from './booking.component';
import { BookingCardComponent } from './shared/booking-card/booking-card.component';


@NgModule({
  declarations: [
    BookingComponent,
    BookingsComponent,
    BookingCardComponent
  ],
  imports: [
    CommonModule,
    BookingRoutingModule
  ]
})
export class BookingModule { }
