import { NgModule } from '@angular/core';
import { FaqComponent } from './faq.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FaqRoutingModule } from './faq-routing.module';
import { WidgetsModule } from 'src/app/widgets/widgets.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FaqRoutingModule,
    WidgetsModule
  ],
  declarations: [FaqComponent],
})
export class FaqModule {}
