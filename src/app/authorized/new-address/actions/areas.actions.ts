import { createAction, props } from '@ngrx/store';
import { Area } from '../models/address.structure';

export const LOAD = createAction(
  '[Edit Address] Load Areas',
  props<{ stateId: string; cityId: string }>(),
);

export const SUCCESS = createAction(
  '[Edit Address] Load Areas Success',
  props<{ areas: Area[] }>(),
);

export const FAILED = createAction(
  '[Edit Address] Load Areas Failed',
  props<{ error: string }>(),
);
