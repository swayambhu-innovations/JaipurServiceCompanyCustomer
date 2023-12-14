import { Time } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedArrayService } from '../../shared-array.service';
import { Booking } from '../booking/booking.structure';
import { CartService } from './cart.service';
import { DataProviderService } from 'src/app/core/data-provider.service';
import { ModalController } from '@ionic/angular';
import { OffersComponent } from './offers/offers.component';
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
    public dataProvider:DataProviderService,
    private modalController:ModalController
  ) {
    
    this.cartService.cartSubject.subscribe((bookings)=>{
      console.log("Updated bookings",bookings);
      if (this.selectedBooking?.id){
        let foundBooking = bookings.find((booking)=>booking.id===this.selectedBooking!.id)?.id;
        if (foundBooking){
          this.selectedBooking.id = foundBooking;
          this.cartService.calculateBilling(this.selectedBooking);
          console.log("Updated selected booking",this.selectedBooking);
        }
      }
    })
    this.activatedRoute.params.subscribe(params => {
      console.log(params);
    })
  }

  notification(){
    this.router.navigate(["authorized/notification"]);
  }

  temp(){
    console.log(this.dataProvider.currentBooking);
  }


  async onOffersClick() {
    let modal = await this.modalController.create({
      component:OffersComponent,
      componentProps:{
        booking:this.selectedBooking
      }
    });
    modal.present();
  }

  services: Service[] = [];

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
  ngOnInit() {
    console.log(this.selectedBooking);
  }

  calculateTotal() {}
  checkout() {}
  removeFromCart(service: any) {}

  offerDiscount: number = 999;
}
  