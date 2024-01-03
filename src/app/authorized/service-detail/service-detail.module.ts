import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServiceDetailPageRoutingModule } from './service-detail-routing.module';

import { RemoveExtraBrPipe, ServiceDetailPage } from './service-detail.page';
import { BodyComponent } from './body/body.component';
import { WidgetsModule } from 'src/app/widgets/widgets.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServiceDetailPageRoutingModule,
    WidgetsModule
  ],
  declarations: [ServiceDetailPage,BodyComponent,RemoveExtraBrPipe],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA]
})
export class ServiceDetailPageModule {}
