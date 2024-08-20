import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JscLogoPageRoutingModule } from './jsc-logo-routing.module';

import { JscLogoPage } from './jsc-logo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JscLogoPageRoutingModule
  ],
  declarations: [JscLogoPage]
})
export class JscLogoPageModule {}
