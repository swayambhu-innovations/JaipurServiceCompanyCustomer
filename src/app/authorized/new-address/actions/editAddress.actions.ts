import { createAction, props } from '@ngrx/store';
import {
  Area,
  City,
  State,
} from '../models/address.structure';

export const saveAddressAction = createAction(
  '[Edit Address] Save Address',
  props<{
    state: State;
    city: City;
    pincode: string;
    area: Area;
    street: string;
    longitude: number;
    latitude: number;
  }>(),
);
export const saveAddressSuccessAction = createAction(
  '[Edit Address] Save Address Success',
);
export const saveAddressFailedAction = createAction(
  '[Edit Address] Save Address Failed',
  props<{ error: string }>(),
);
