import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReferAfriendPageRoutingModule } from './refer-afriend-routing.module';

import { ReferAfriendPage } from './refer-afriend.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReferAfriendPageRoutingModule
  ],
  declarations: [ReferAfriendPage]
})
export class ReferAfriendPageModule {}
