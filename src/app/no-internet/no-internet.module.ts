import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NoInternetComponent } from './no-internet.component';
import { NoInternetRoutingModule } from './no-internet-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NoInternetRoutingModule
  ],
  declarations: [NoInternetComponent]
})
export class NoInternetPageModule {}
