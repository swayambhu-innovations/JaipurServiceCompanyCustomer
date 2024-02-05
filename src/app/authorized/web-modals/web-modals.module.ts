import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WebModalsComponent } from '../web-modals/web-modals.component';
@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [WebModalsComponent],
  exports: [WebModalsComponent],
})
export class WebModalModule {}
