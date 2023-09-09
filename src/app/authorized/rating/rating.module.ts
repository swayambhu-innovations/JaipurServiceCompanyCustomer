import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RatingPageRoutingModule } from './rating-routing.module';

import { RatingPage } from './rating.page';
import { WidgetsModule } from '../../widgets/widgets.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RatingPageRoutingModule,
    WidgetsModule
  ],
  declarations: [RatingPage]
})
export class RatingPageModule {}
