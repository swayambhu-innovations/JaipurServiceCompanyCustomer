import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthorizedPageRoutingModule } from './authorized-routing.module';

import { AuthorizedPage } from './authorized.page';
import { NavbarPage } from './navbar/navbar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuthorizedPageRoutingModule
  ],
  declarations: [
    AuthorizedPage,
    NavbarPage
  ],
  exports:[NavbarPage]
})
export class AuthorizedPageModule {}
