import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectSlotPageRoutingModule } from './select-slot-routing.module';

import { SelectSlotPage } from './select-slot.page';
import { WidgetsModule } from '../../widgets/widgets.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectSlotPageRoutingModule,
    WidgetsModule
  ],
  declarations: [SelectSlotPage]
})
export class SelectSlotPageModule {}
