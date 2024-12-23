import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavParams } from '@ionic/angular';
import { SubCategoryPage } from './sub-categories.page';
import { SubCategoryPageRoutingModule } from './sub-categories-routing.module';
import { WidgetsModule } from 'src/app/widgets/widgets.module';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    IonicModule,
    SubCategoryPageRoutingModule,
    WidgetsModule,
  ],
  declarations: [SubCategoryPage],
})
export class SubCategoryPageModule {}
