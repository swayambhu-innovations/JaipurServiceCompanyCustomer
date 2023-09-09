import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookingEmptyPageRoutingModule } from './booking-empty-routing.module';

import { BookingEmptyPage } from './booking-empty.page';
import { WidgetsModule } from "../../widgets/widgets.module";

@NgModule({
    declarations: [BookingEmptyPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        BookingEmptyPageRoutingModule,
        WidgetsModule
    ]
})
export class BookingEmptyPageModule {}
