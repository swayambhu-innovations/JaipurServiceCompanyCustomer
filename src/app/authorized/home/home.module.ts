import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { WidgetsModule } from '../../widgets/widgets.module';



// swiper

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    WidgetsModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage, 
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePageModule {}
