import { NgModule } from '@angular/core';
import { CommonModule, DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileInfoPageRoutingModule } from './profile-info-routing.module';

import { ProfileInfoPage } from './profile-info.page';
import { WidgetsModule } from 'src/app/widgets/widgets.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileInfoPageRoutingModule,
    WidgetsModule,
    ReactiveFormsModule,
  ],
  declarations: [ProfileInfoPage],
  providers:[{provide: DATE_PIPE_DEFAULT_OPTIONS, useValue: {dateFormat: 'DD/MM/yyyy'}}]
})
export class ProfileInfoPageModule {}
