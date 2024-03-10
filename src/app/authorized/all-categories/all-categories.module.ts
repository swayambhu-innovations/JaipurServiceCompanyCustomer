import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllCategoriesPageRoutingModule } from './all-categories-routing.module';

import { AllCategoriesPage } from './all-categories.page';
import { WidgetsModule } from 'src/app/widgets/widgets.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllCategoriesPageRoutingModule,
    WidgetsModule
  ],
  declarations: [AllCategoriesPage]
})
export class AllCategoriesPageModule { }
