import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReferAfriendPageRoutingModule } from './refer-afriend-routing.module';

import { ReferAfriendPage } from './refer-afriend.page';
import { WidgetsModule } from 'src/app/widgets/widgets.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReferAfriendPageRoutingModule,
    WidgetsModule
  ],
  declarations: [ReferAfriendPage]
})
export class ReferAfriendPageModule {}
