import { Category } from './category.structure';
import { Area, City, State } from './address.structure';
import { Timestamp } from '@angular/fire/firestore';

export interface SignupState {
  categories: Category[];
  error: any;
  states: State[];
  cities: City[];
  areas: Area[];
  pendingUser: PendingUser;
  loadingCatalogue: boolean;
}
export interface PendingUser {
  // stage one
  name?: string;
  gender?:'male'|'female'|'other';
  panNumber?: string;
  aadhaarNumber?: string;
  aadhaarImage?: string;
  panImage?: string;
  userImage?: string;
  dateOfBirth?:Timestamp;
  email?: string;
  // stage two
  state?: State;
  city?: City;
  pincode?: string;
  area?: Area;
  street?: string;
  longitude?: number;
  latitude?: number;
  // stage three
  selectedCategories?: {
    categoryId: string;
    subCategoryId: string;
  }[];
  selectedAreas?: {
    stateId: string;
    cityId: string;
    areaId: string;
  }[];
}
