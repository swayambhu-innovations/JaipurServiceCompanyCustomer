import { Component, Input, OnInit } from '@angular/core';
import { Booking } from '../../booking/booking.structure';
import { ModalController } from '@ionic/angular';

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
  onApplyClick(copan:any){
    console.log("selected Copan.........: ",copan)
    this.selectedCoupan = copan;
  }
  searchcoupons(){
    console.log("searchValue.......:",this.searchValue)
    let coopen = this.coupons.filter(coupon=> coupon.code == this.searchValue) || undefined;
    console.log("co.........: ", coopen)
    this.selectedCoupan = coopen[0];
  }
}
