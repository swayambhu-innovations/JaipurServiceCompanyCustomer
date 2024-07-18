import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchLocPageRoutingModule } from './search-loc-routing.module';

import { SearchLocPage } from './search-loc.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchLocPageRoutingModule
  ],
  declarations: [SearchLocPage]
})
export class SearchLocPageModule {}
