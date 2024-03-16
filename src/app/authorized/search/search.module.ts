import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchPageRoutingModule } from './search-routing.module';

import { SearchPage } from './search.page';
import { WidgetsModule } from '../../widgets/widgets.module';
import { AutoFocus } from './autofocus.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchPageRoutingModule,
    WidgetsModule,
  ],
  declarations: [SearchPage, AutoFocus],
})
export class SearchPageModule {}
