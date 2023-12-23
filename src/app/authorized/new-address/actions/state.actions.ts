import { createAction, props } from '@ngrx/store';
import { State } from '../models/address.structure';

export const LOAD = createAction('[Edit Address] Load States');

export const SUCCESS = createAction(
  '[Edit Address] Load States Success',
  props<{ states: State[] }>(),
);

export const FAILED = createAction(
  '[Edit Address] Load States Failed',
  props<{ error: string }>(),
);
