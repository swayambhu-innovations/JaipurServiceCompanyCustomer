import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { ConfirmationResult, User } from '@angular/fire/auth';
import { Category } from './types/category.structure';
import { Booking } from '../authorized/booking/booking.structure';
import { Address } from '../authorized/select-address/address.structure';
import { DeviceDetectorService } from 'ngx-device-detector';

@Injectable({
  providedIn: 'root',
})
export class DataProviderService {
  isFirstTime: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  mainCategories: BehaviorSubject<Category[]> = new BehaviorSubject<Category[]>(
    []
  );
  mainCategoriesLoaded: boolean = false;
  loggedIn: boolean = false;
  selectedCatalog: string = '';
  userMobile: string = '';
  selectedAddress: BehaviorSubject<Address[]> = new BehaviorSubject<Address[]>(
    []
  );
  checkingAuth: boolean = true;
  loginConfirmationResult: ConfirmationResult | undefined;
  currentBooking: Booking | undefined;
  isSignUpUserID: string = '';
  currentUser:
    | {
        user: any;
        userData: any;
      }
    | undefined;
  currentUser$: BehaviorSubject<any> = new BehaviorSubject<any>('');
  isPageLoaded$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  deviceInfo: any;
  authLessAddress: any;
  constructor(private deviceService: DeviceDetectorService) {
    this.deviceInfo = this.deviceService.getDeviceInfo();
  }
}
