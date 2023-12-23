import { Component, Input, OnInit } from '@angular/core';
import { Booking } from '../../booking/booking.structure';
import { ModalController } from '@ionic/angular';
import * as $ from 'jquery';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss'],
})
export class OffersComponent  implements OnInit {
  booking:Booking|undefined;
  applicableDiscounts;
  searchValue:string = "";
  selectedCoupan:any;
  coupons:any[]=[
   
  ];
  constructor(public modalController:ModalController,public cartService:CartService,) {
   }

  ngOnInit() {
    this.booking?.services.forEach((service)=>{
      this.coupons = [...this.coupons,...service.discounts];
    });
  }
  onApplyClick(bookingId:any,discount:any){
    $(".apply-button").show();
    $(".remove-button").hide();
    $("#"+discount.code).hide();
    $("#"+discount.id).show();
    this.selectedCoupan = discount;
    this.cartService.applyCoupon(bookingId,discount);
  }
  onRemoveClick(bookingId:any, coupan:any){
    $(".apply-button").show();
    $(".remove-button").hide();
    $("#"+coupan.code).show();
    $("#"+coupan.id).hide();
    this.selectedCoupan = undefined;
    this.cartService.removeCoupon(bookingId);
  }
  searchcoupons(){
    console.log("searchValue.......:",this.searchValue)
    let coopen = this.coupons.filter(coupon=> coupon.code == this.searchValue) || undefined;
    console.log("co.........: ", coopen)
    this.selectedCoupan = coopen[0];
  }
}
