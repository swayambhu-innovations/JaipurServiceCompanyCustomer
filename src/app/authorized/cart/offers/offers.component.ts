import { Component, Input, OnInit } from '@angular/core';
import { Booking } from '../../booking/booking.structure';
import { ModalController } from '@ionic/angular';
import * as $ from 'jquery';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss'],
})
export class OffersComponent  implements OnInit {
  @Input({required:true}) booking:Booking|undefined;
  searchValue:string = "";
  selectedCoupan:any;
  coupons:any[]=[
   
  ];
  constructor(public modalController:ModalController) {
   }

  ngOnInit() {
    this.booking?.services.forEach((service)=>{
      this.coupons = [...this.coupons,...service.discounts];
    });
  }
  onApplyClick(coupan:any){
    $(".apply-button").show();
    $(".remove-button").hide();
    $("#"+coupan.code).hide();
    $("#"+coupan.id).show();
    this.selectedCoupan = coupan;
  }
  onRemoveClick(coupan:any){
    $(".apply-button").show();
    $(".remove-button").hide();
    $("#"+coupan.code).show();
    $("#"+coupan.id).hide();
    this.selectedCoupan = undefined;
  }
  searchcoupons(){
    console.log("searchValue.......:",this.searchValue)
    let coopen = this.coupons.filter(coupon=> coupon.code == this.searchValue) || undefined;
    console.log("co.........: ", coopen)
    this.selectedCoupan = coopen[0];
  }
}
