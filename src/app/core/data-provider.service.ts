import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { ConfirmationResult, User } from '@angular/fire/auth';
import { Category } from './types/category.structure';
import { Booking } from '../authorized/booking/booking.structure';
import { Address } from '../authorized/select-address/address.structure';

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {
  isFirstTime:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  mainCategories:BehaviorSubject<Category[]>=new BehaviorSubject<Category[]>([]);
  mainCategoriesLoaded:boolean = false;
  loggedIn:boolean=false;
  selectedCatalog:string = '';
  userMobile:string= '';
  selectedAddress:BehaviorSubject<Address[]>=new BehaviorSubject<Address[]>([]);
  checkingAuth:boolean=true;
  loginConfirmationResult:ConfirmationResult|undefined;
  currentBooking:Booking|undefined;
  currentUser:{
    user:User,
    userData:any;
  }|undefined;
  currentUser$:BehaviorSubject<any> = new BehaviorSubject<any>('');
  isPageLoaded$:BehaviorSubject<string> = new BehaviorSubject<string>("");
  constructor() {
   }
}
