import { CommonModule } from '@angular/common';
import {NgModule} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SubCategoryPage } from './sub-categories.page';
import { SubCategoryPageRoutingModule } from './sub-categories-routing.module';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        IonicModule,
        SubCategoryPageRoutingModule
    ],
    declarations: [SubCategoryPage]
})

export class SubCategoryPageModule {}