import { Time } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedArrayService } from '../../shared-array.service';
// import { ActionSheetController } from '@ionic/angular';



interface Service{
  serviceName:string;
  serviceTime:Time;
  serviceRating:number;
  serviceTotalRatingCount:number;
  serviceOriginalPrice:number;
  serviceDiscountedPrice:number;
  serviceThumbnailPath:string;
  serviceOrderCount:number;
}
export class HomePage {
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
// action sheet buttons
isModalOpen = true;

setOpen(isOpen: boolean) {
  this.isModalOpen = isOpen;
}
  // coupons array
  coupons = this.sharedArrayService.getCoupons();
  appliedCoupons=this.sharedArrayService.getAppliedCoupons();

  emptyAppliedCouponsArray(){
    this.sharedArrayService.setAppliedCoupons([]);
    window.location.reload();
  }

  constructor(private router: Router,private sharedArrayService: SharedArrayService) {}
  onOffersClick() {
    this.router.navigate(['/offers']);
  }

  services: Service[] = [
    { serviceName:'AC Uninstallation',
      serviceTime:{hours:1,minutes:0},
      serviceRating:4.5,
      serviceTotalRatingCount:85,
      serviceOriginalPrice:999,
      serviceDiscountedPrice:799,
      serviceThumbnailPath:'../../../assets/images/Mask Group.png',
      serviceOrderCount:1},
      { serviceName:'AC Installation',
      serviceTime:{hours:1,minutes:30},
      serviceRating:4.0,
      serviceTotalRatingCount:105,
      serviceOriginalPrice:999,
      serviceDiscountedPrice:699,
      serviceThumbnailPath:'../../../assets/images/Mask Group.png',
      serviceOrderCount:1}
  ];
  
  addTime(time1: Time, time2: Time): Time {
    const result: Time = {
      hours: time1.hours + time2.hours,
      minutes: time1.minutes + time2.minutes
    };
    if (result.minutes >= 60) {
      result.hours += Math.floor(result.minutes / 60);
      result.minutes %= 60;
    }
    return result;
  }

  get totalTimeNeeded(){
    return this.services.reduce((totalTime:{hours:number,minutes:number},service:Service)=>{
      return this.addTime(totalTime,service.serviceTime)
    },{hours:0,minutes:30})
  }
  get totalMRP(){
    return this.services.reduce((totalPrice:number,service:Service)=>{
      return totalPrice+service.serviceOriginalPrice*service.serviceOrderCount;
    },0)
  }
  get totalServiceCount(){
    return this.services.reduce((totalCount:number,service:Service)=>{
      return totalCount+service.serviceOrderCount;
    },0)
  }
  

  removeService(serviceToRemove: Service) {
    this.services = this.services.filter((service) => service !== serviceToRemove);
  }

  increaseServiceCount(onService:Service){
    onService.serviceOrderCount++;
  }
  deccreaseServiceCount(onService:Service){
    onService.serviceOrderCount--;
  }
  orderCount:any=2;
  ngOnInit() {
  }
  
  calculateTotal(){

  }
  checkout(){}
  removeFromCart(service:any){}

  offerDiscount:number=999;

}
