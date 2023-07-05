import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header1Component } from './header1/header1.component';
import { IonicModule } from '@ionic/angular';
import { RateComponent } from './rate/rate.component';

const widgets = [Header1Component,RateComponent]

@NgModule({
  declarations: [Header1Component,RateComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports:widgets
})
export class WidgetsModule { }
