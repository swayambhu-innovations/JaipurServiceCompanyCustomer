import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { mergeMap } from 'rxjs';
import { AddressService } from '../services/address.service';
import {
  editAddressAreasActions,
  editAddressCitiesActions,
  editAddressStateActions,
} from '../actions';
import {
  Area,
  City,
  State,
} from '../models/address.structure';

@Injectable()
export class EditAddressEffects {
  constructor(
    private actions: Actions,
    private addressService: AddressService,
  ) {}

  loadStateEffect$ = createEffect(() =>
    this.actions.pipe(
      ofType(editAddressStateActions.LOAD),
      mergeMap(() => {
        return this.addressService
          .loadStates()
          .then((data) =>
            editAddressStateActions.SUCCESS({
              states: data.docs.map((doc) => {
                return { id: doc.id, ...doc.data() } as State;
              }),
            }),
          )
          .catch(() =>
            editAddressStateActions.FAILED({
              error: 'Error while loading states',
            }),
          );
      }),
    ),
  );

  loadCityEffect$ = createEffect(() =>
    this.actions.pipe(
      ofType(editAddressCitiesActions.LOAD),
      mergeMap((action) => {
        return this.addressService
          .loadCities(action.stateId)
          .then((data) =>
            editAddressCitiesActions.SUCCESS({
              cities: data.docs.map((doc) => {
                return { id: doc.id, ...doc.data() } as City;
              }),
            }),
          )
          .catch(() =>
            editAddressCitiesActions.FAILED({
              error: 'Error while loading states',
            }),
          );
      }),
    ),
  );

  loadAreaEffect$ = createEffect(() =>
    this.actions.pipe(
      ofType(editAddressAreasActions.LOAD),
      mergeMap((action) => {
        return this.addressService
          .loadAreas(action.stateId, action.cityId)
          .then((data) =>
            editAddressAreasActions.SUCCESS({
              areas: data.docs.map((doc) => {
                return { id: doc.id, ...doc.data() } as Area;
              }),
            }),
          )
          .catch(() =>
            editAddressAreasActions.FAILED({
              error: 'Error while loading states',
            }),
          );
      }),
    ),
  );
}
