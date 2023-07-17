import { Injectable } from '@angular/core';

interface Coupon{
  couponId:number,
  percentageOff:number;
  cardName:string;
  discountOnPrice:number;
  minOrderValue:number;
}
@Injectable({
  providedIn: 'root'
})
export class SharedArrayService {

  appliedCoupons:Coupon[]=[];

  coupons:Coupon[]=[{
    couponId:1,
    percentageOff:15,
    cardName:"Kotak Credit Card",
    discountOnPrice:149,
    minOrderValue:359
  },{
    couponId:2,
    percentageOff:20,
    cardName:"HDFC Debit Card",
    discountOnPrice:199,
    minOrderValue:399
  },{
    couponId:3,
    percentageOff:25,
    cardName:"Axis Bank Debit Card",
    discountOnPrice:299,
    minOrderValue:699
  }
];

  // pushToAppliedCoupens(coo:Coupon){
  //   this.appliedCoupons.push(coo);
  // }

  getAppliedCoupons(): any[] {
    return this.appliedCoupons;
  }
  getCoupons(): any[] {
    return this.coupons;
  }
  setAppliedCoupons(array: any[]): void {
    this.appliedCoupons = array;
  }
  setCoupons(array: any[]): void {
    this.coupons = array;
  }

  constructor() { }
}
