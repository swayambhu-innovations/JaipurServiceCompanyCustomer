import {
  Area,
  City,
  State,
} from './address.structure';

export interface EditAddressPageState {
  states: State[];
  cities: City[];
  areas: Area[];
}
