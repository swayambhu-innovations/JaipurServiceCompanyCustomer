import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { ConfirmationResult, User } from '@angular/fire/auth';
import { Category } from './types/category.structure';
import { Booking } from '../authorized/booking/booking.structure';

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {
  mainCategories:ReplaySubject<Category[]>=new ReplaySubject<Category[]>(1);
  loggedIn:boolean=false;
  userMobile:string= '';
  checkingAuth:boolean=true;
  loginConfirmationResult:ConfirmationResult|undefined;
  currentBooking:Booking|undefined;
  currentUser:{
    user:User,
    userData:any;
  }|undefined;
  constructor() {
    console.log("data provider works");
   }


}
