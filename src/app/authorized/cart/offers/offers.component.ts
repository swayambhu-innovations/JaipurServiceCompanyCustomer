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
  hasApplicableDiscounts:boolean = false;
  coupons:any[]=[];
  subTotal:any;
  appliedCoupon: any;
  constructor(public modalController:ModalController,public cartService:CartService,) {
   }

  ngOnInit() {
    this.booking?.services.forEach((service)=>{
      this.coupons = [...this.coupons,...service.discounts];
      service.discountsApplicable?.map((discount) => {
        if((discount.type == 'flat' && discount?.value <= this.subTotal) || (discount.type != 'flat')){
          this.hasApplicableDiscounts = true;
        }
      });
    });
  }

  onApplyClick(bookingId:any,discount:any){
    this.appliedCoupon = discount;
    this.cartService.applyCoupon(bookingId,discount);
  }

  getIsApplied(discount){
    return this.appliedCoupon? this.appliedCoupon.id == discount.id : false;
  }

  onRemoveClick(bookingId:any, coupan:any){
    this.appliedCoupon = undefined;
    this.cartService.removeCoupon(bookingId);
  }

  searchcoupons(){
    let coopen = this.coupons.filter(coupon=> coupon.code == this.searchValue) || undefined;
    this.selectedCoupan = coopen[0];
  }
}
