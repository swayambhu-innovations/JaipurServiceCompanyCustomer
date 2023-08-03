import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpcomingHistoryPageRoutingModule } from './upcoming-history-routing.module';

import { UpcomingHistoryPage } from './upcoming-history.page';
import { HomePageRoutingModule } from 'src/app/home/home-routing.module';
import { WidgetsModule } from 'src/app/widgets/widgets.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpcomingHistoryPageRoutingModule,
    HomePageRoutingModule,
    WidgetsModule
  ],
  declarations: [UpcomingHistoryPage]
})
export class UpcomingHistoryPageModule {}
