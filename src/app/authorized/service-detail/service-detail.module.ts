import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServiceDetailPageRoutingModule } from './service-detail-routing.module';

import { RemoveExtraBrPipe, ServiceDetailPage } from './service-detail.page';
import { BodyComponent } from './body/body.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServiceDetailPageRoutingModule
  ],
  declarations: [ServiceDetailPage,BodyComponent,RemoveExtraBrPipe]
})
export class ServiceDetailPageModule {}
