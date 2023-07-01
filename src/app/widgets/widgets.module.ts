import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';
import { HomeHeaderComponent } from './home-header/home-header.component';


const widgets = [HeaderComponent,HomeHeaderComponent]

@NgModule({
  declarations: [widgets],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports:widgets
})
export class WidgetsModule { }
