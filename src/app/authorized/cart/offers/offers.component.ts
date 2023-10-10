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
    {
      percentageOff: 10,
      cardName: '10% off',
      minOrderValue:500,
      discountOnPrice:200
    }
  ];
  constructor(public modalController:ModalController) { }

  ngOnInit() {
    // this.booking?.services.forEach((service)=>{
    //   this.coupons.concat(service.discounts);
    // })
  }

}
