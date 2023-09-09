import { Component, OnInit } from '@angular/core';
import { DataProviderService } from 'src/app/core/data-provider.service';
import { PaymentService } from 'src/app/payment.service';
import { BookingService } from '../booking/booking.service';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CartService } from '../cart/cart.service';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-select-slot',
  templateUrl: './select-slot.page.html',
  styleUrls: ['./select-slot.page.scss'],
})
export class SelectSlotPage implements OnInit {
  name = 'Select Slot';
  selectedDate:Date|undefined;
  selectedTime:Date|undefined;
  dates:Date[] = [];

  times:Date[] = []

  constructor(public dataProvider:DataProviderService, private paymentService:PaymentService, private bookingService:BookingService,  private loadingController: LoadingController, private router:Router, private cartService:CartService) { }

  ngOnInit() {
    // regenrate the slots
    this.generateSlots();
  }

  generateSlots(){
    // fill dates with next 7 days starting from today
    let today = new Date();
    for(let i=0;i<7;i++){
      let date = new Date(today.getFullYear(), today.getMonth(), today.getDate()+i);
      this.dates.push(date);
    }
    // fill times with 8am to 8pm
    for(let i=8;i<=20;i++){
      let date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), i);
      this.times.push(date);
    }
  }

  setSlot(){
    this.dataProvider.currentBooking!.timeSlot = {
      date: Timestamp.fromDate(this.selectedDate!),
      time: Timestamp.fromDate(this.selectedTime!)
    }
  }

  async createBooking(){
    let loader = await this.loadingController.create({message:'Please wait...'});
    loader.present();
    this.paymentService.handlePayment({
      grandTotal: this.dataProvider.currentBooking!.billing.grandTotal,
      user:{
        phone: this.dataProvider.currentUser?.user.phoneNumber || '',
      }
    }).subscribe((paymentResponse)=>{
      if(JSON.parse(paymentResponse['body']).status == 'captured'){
        this.dataProvider.currentBooking!.payment = JSON.parse(paymentResponse['body']);
        this.bookingService.addBooking(this.dataProvider.currentBooking!, this.dataProvider.currentUser!.user!.uid).then(async ()=>{
          await this.cartService.deleteBooking(this.dataProvider.currentUser!.user.uid,this.dataProvider.currentBooking!.id!);
          this.router.navigate(['/authorized/order-placed']);
        }).finally(()=>{
          loader.dismiss();
        })
      }
    })
  }

}
