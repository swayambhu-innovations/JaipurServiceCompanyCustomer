import { createAction, props } from '@ngrx/store';
import { City } from '../models/address.structure';

export const LOAD = createAction(
  '[Edit Address] Load Cities',
  props<{ stateId: string }>(),
);

export const SUCCESS = createAction(
  '[Edit Address] Load Cities Success',
  props<{ cities: City[] }>(),
);

export const FAILED = createAction(
  '[Edit Address] Load Cities Failed',
  props<{ error: string }>(),
);
