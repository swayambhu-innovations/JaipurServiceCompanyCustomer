import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NoNotificationPageRoutingModule } from './no-notification-routing.module';

import { NoNotificationPage } from './no-notification.page';
import { WidgetsModule } from 'src/app/widgets/widgets.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NoNotificationPageRoutingModule,
    WidgetsModule
  ],
  declarations: [NoNotificationPage]
})
export class NoNotificationPageModule {}
