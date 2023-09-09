import { Time } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedArrayService } from '../../shared-array.service';
import { Booking } from '../booking/booking.structure';
import { CartService } from './cart.service';
import { DataProviderService } from 'src/app/core/data-provider.service';
// import { ActionSheetController } from '@ionic/angular';

interface Service {
  serviceName: string;
  serviceTime: Time;
  serviceRating: number;
  serviceTotalRatingCount: number;
  serviceOriginalPrice: number;
  serviceDiscountedPrice: number;
  serviceThumbnailPath: string;
  serviceOrderCount: number;
}
export class HomePage {}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  // action sheet buttons
  isModalOpen = true;
  bookings:Booking[]=[];
  selectedBooking:Booking|undefined;
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
  // coupons array
  coupons = this.sharedArrayService.getCoupons();
  appliedCoupons = this.sharedArrayService.getAppliedCoupons();

  emptyAppliedCouponsArray() {
    this.sharedArrayService.setAppliedCoupons([]);
    window.location.reload();
  }

  constructor(
    private router: Router,
    private sharedArrayService: SharedArrayService,
    private activatedRoute:ActivatedRoute,
    public cartService:CartService,
    public dataProvider:DataProviderService
  ) {
    this.activatedRoute.params.subscribe(params => {
      console.log(params);
    })
  }

    back(){
      this.router.navigate(['home'])
    }

  onOffersClick() {
    this.router.navigate(['/offers']);
  }

  services: Service[] = [
    {
      serviceName: 'AC Uninstallation',
      serviceTime: { hours: 1, minutes: 0 },
      serviceRating: 4.5,
      serviceTotalRatingCount: 85,
      serviceOriginalPrice: 999,
      serviceDiscountedPrice: 799,
      serviceThumbnailPath: '../../../assets/images/Mask Group.png',
      serviceOrderCount: 1,
    },
    {
      serviceName: 'AC Installation',
      serviceTime: { hours: 1, minutes: 30 },
      serviceRating: 4.0,
      serviceTotalRatingCount: 105,
      serviceOriginalPrice: 999,
      serviceDiscountedPrice: 699,
      serviceThumbnailPath: '../../../assets/images/Mask Group.png',
      serviceOrderCount: 1,
    },
  ];

  addTime(time1: {minutes:number}, time2: {minutes:number}): {minutes:number} {
    const result: {minutes:number} = {
      minutes: time1.minutes + time2.minutes,
    };
    if (result.minutes >= 60) {
      result.minutes %= 60;
    }
    return result;
  }

  get totalTimeNeeded() {
    return this.services.reduce(
      (totalTime: { minutes: number }, service: Service) => {
        return this.addTime(totalTime, service.serviceTime);
      },
      { minutes: 0 }
    );
  }


  removeService(serviceToRemove: Service) {
    this.services = this.services.filter(
      (service) => service !== serviceToRemove
    );
  }

  increaseServiceCount(onService: Service) {
    onService.serviceOrderCount++;
  }
  deccreaseServiceCount(onService: Service) {
    onService.serviceOrderCount--;
  }
  orderCount: any = 2;
  ngOnInit() {}

  calculateTotal() {}
  checkout() {}
  removeFromCart(service: any) {}

  offerDiscount: number = 999;
}
  