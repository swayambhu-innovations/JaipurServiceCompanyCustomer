import { createReducer, on } from '@ngrx/store';
import { EditAddressPageState } from '../models/edit-address.structure';
import {
  editAddressAreasActions,
  editAddressCitiesActions,
  editAddressStateActions,
} from '../actions';

export const initialState: EditAddressPageState = {
  areas: [],
  cities: [],
  states: [],
};

export const editAddressReducer = createReducer(
  initialState,
  on(editAddressStateActions.SUCCESS, (state, { states }) => ({
    ...state,
    states,
  })),
  on(editAddressStateActions.FAILED, (state, { error }) => ({
    ...state,
    error,
  })),
  on(editAddressCitiesActions.SUCCESS, (state, { cities }) => ({
    ...state,
    cities,
  })),
  on(editAddressCitiesActions.FAILED, (state, { error }) => ({
    ...state,
    error,
  })),
  on(editAddressAreasActions.SUCCESS, (state, { areas }) => ({
    ...state,
    areas,
  })),
  on(editAddressAreasActions.FAILED, (state, { error }) => ({
    ...state,
    error,
  })),
);
