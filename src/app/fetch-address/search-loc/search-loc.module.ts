import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchLocPageRoutingModule } from './search-loc-routing.module';

import { SearchLocPage } from './search-loc.page';
import { WidgetsModule } from 'src/app/widgets/widgets.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchLocPageRoutingModule,
    WidgetsModule,
  ],
  declarations: [SearchLocPage],
})
export class SearchLocPageModule {}
