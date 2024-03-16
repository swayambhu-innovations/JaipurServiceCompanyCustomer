import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RefundPolicyPageRoutingModule } from './refund-policy-routing.module';

import { RefundPolicyPage } from './refund-policy.page';
import { WidgetsModule } from 'src/app/widgets/widgets.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WidgetsModule,
    RefundPolicyPageRoutingModule
  ],
  declarations: [RefundPolicyPage]
})
export class RefundPolicyPageModule {}
