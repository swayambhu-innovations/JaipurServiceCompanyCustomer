import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header1Component } from './header1/header1.component';
import { IonicModule } from '@ionic/angular';
import { RateComponent } from './rate/rate.component';
import { HomeHeaderComponent } from './home-header/home-header.component';
import { HeaderComponent } from './header/header.component';

const widgets = [
  Header1Component,
  RateComponent,
  HomeHeaderComponent,
  HeaderComponent
]

@NgModule({
  declarations: [
    Header1Component,
    RateComponent,
    HomeHeaderComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: widgets
})
export class WidgetsModule { }
