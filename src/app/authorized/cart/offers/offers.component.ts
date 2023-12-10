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
  coupons:any[]=[
   
  ];
  constructor(public modalController:ModalController) {
   }

  ngOnInit() {
    this.booking?.services.forEach((service)=>{
      console.log("service.discounts///////: ",service.discounts)
      this.coupons = [...this.coupons,...service.discounts];
    });
    console.log("coupons......: ",this.coupons)
  }
  onApplyClick(copan:any){
    console.log("selected Copan.........: ",copan)
  }
}
