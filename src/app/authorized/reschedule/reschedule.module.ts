import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReschedulePageRoutingModule } from './reschedule-routing.module';

import { ReschedulePage } from './reschedule.page';
import { WidgetsModule } from "../../widgets/widgets.module";

@NgModule({
    declarations: [ReschedulePage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReschedulePageRoutingModule,
        WidgetsModule
    ]
})
export class ReschedulePageModule {}
