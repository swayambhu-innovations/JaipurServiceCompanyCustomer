import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewAddressPageRoutingModule } from './new-address-routing.module';

import { NewAddressPage } from './new-address.page';
import { GoogleMapsModule } from '@angular/google-maps';
import { editAddressReducer } from './reducers/edit-address.reducer';
import { EditAddressEffects } from './effects/edit-address.effect';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { WidgetsModule } from 'src/app/widgets/widgets.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewAddressPageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    GoogleMapsModule,
    WidgetsModule,
    StoreModule.forFeature('editAddress', editAddressReducer),
    EffectsModule.forFeature([EditAddressEffects]),
  ],
  declarations: [NewAddressPage]
})
export class NewAddressPageModule {}
