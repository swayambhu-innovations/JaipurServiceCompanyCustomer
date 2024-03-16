import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TncPageRoutingModule } from './tnc-routing.module';

import { TncPage } from './tnc.page';
import { WidgetsModule } from 'src/app/widgets/widgets.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WidgetsModule,
    TncPageRoutingModule
  ],
  declarations: [TncPage]
})
export class TncPageModule {}
