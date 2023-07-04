import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header1Component } from './header1/header1.component';
import { IonicModule } from '@ionic/angular';

const widgets = [Header1Component]

@NgModule({
  declarations: [Header1Component],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports:widgets
})
export class WidgetsModule { }
