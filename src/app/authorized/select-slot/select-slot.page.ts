import { Component, OnInit } from '@angular/core';
import { DataProviderService } from 'src/app/core/data-provider.service';
import { PaymentService } from 'src/app/payment.service';
import { BookingService } from '../booking/booking.service';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CartService } from '../cart/cart.service';
import { Timestamp, collection } from 'firebase/firestore';
import { Firestore, getDocs } from '@angular/fire/firestore';


@Component({
  selector: 'app-select-slot',
  templateUrl: './select-slot.page.html',
  styleUrls: ['./select-slot.page.scss'],
})
export class SelectSlotPage implements OnInit {
  name = 'Address & Time Slot';
  selectedDate:Date|undefined;
  selectedTime:Date|undefined;
  dates:Date[] = [];
  times:Date[] = [];
  slots: any[] = [];


  jobStartingSlot = [
    {
      img : "../../../assets/icon/slots/morning.svg",
      slot : "Morning",
      time : "7 AM - 9 AM"
    },
    {
      img : "../../../assets/icon/slots/lateMorning.svg",
      slot : "Late Morning",
      time : "9 AM - 11 AM"
    },
    {
      img : "../../../assets/icon/slots/afternoon.svg",
      slot : "Afternoon",
      time : "11 AM - 1 PM"
    },
    {
      img : "../../../assets/icon/slots/lateAfternoon.svg",
      slot : "Late Afternoon",
      time : "1 PM - 3 PM"
    },
    {
      img : "../../../assets/icon/slots/evening.svg",
      slot : "Evening",
      time : "3 PM - 5 PM"
    },
    {
      img : "../../../assets/icon/slots/lateEvening.svg",
      slot : "Late Evening",
      time : "5 PM - 7 PM"
    },
    {
      img : "../../../assets/icon/slots/night.svg",
      slot : "Night",
      time : "7 PM - 9 PM"
    }
  ]


  constructor(private firestore:Firestore,public dataProvider:DataProviderService, private paymentService:PaymentService, private bookingService:BookingService,  private loadingController: LoadingController, private router:Router, private cartService:CartService) { }

  ngOnInit() {
    // regenrate the slots
    this.generateSlots();
    this.totalSlots();
  }

  
  
  generateSlots(){
    // fill dates with next 7 days starting from today
    let today = new Date();
    for(let i=0;i<5;i++){
      let date = new Date(today.getFullYear(), today.getMonth(), today.getDate()+i);
      this.dates.push(date);
    }
    
    // fill times with 8am to 8pm
    for(let i=9;i<=11;i++){
      let date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), i);
      this.times.push(date);
    }
  }

  totalSlots(){
    getDocs(collection(this.firestore, 'slots')).then((data) => {
      this.slots = data.docs.map((doc) => {
        return doc.data();
      })
    })
  }

  setSlot(){
    // console.log(this.selectedDate?.getTime());
    this.dataProvider.currentBooking!.timeSlot = {
      date: Timestamp.fromDate(this.selectedDate!),
      time: Timestamp.fromDate(this.selectedTime!)
    }
    // console.log(this.dataProvider.currentBooking!.timeSlot);
  }

  async createBooking(){
    let loader = await this.loadingController.create({message:'Please wait...'});
    loader.present();
    this.bookingService.addBooking(this.dataProvider.currentBooking!, this.dataProvider.currentUser!.user!.uid).then(async ()=>{
      await this.cartService.deleteBooking(this.dataProvider.currentUser!.user.uid,this.dataProvider.currentBooking!.id!);
      this.router.navigate(['/authorized/order-placed']);
    }).finally(()=>{
      loader.dismiss();
    })
    // this.paymentService.handlePayment({
    //   grandTotal: this.dataProvider.currentBooking!.billing.grandTotal,
    //   user:{
    //     phone: this.dataProvider.currentUser?.user.phoneNumber || '',
    //   }
    // }).subscribe((paymentResponse)=>{
    //   if(JSON.parse(paymentResponse['body']).status == 'captured'){
    //     this.dataProvider.currentBooking!.payment = JSON.parse(paymentResponse['body']);
    //     this.bookingService.addBooking(this.dataProvider.currentBooking!, this.dataProvider.currentUser!.user!.uid).then(async ()=>{
    //       await this.cartService.deleteBooking(this.dataProvider.currentUser!.user.uid,this.dataProvider.currentBooking!.id!);
    //       this.router.navigate(['/authorized/order-placed']);
    //     }).finally(()=>{
    //       loader.dismiss();
    //     })
    //   }
    // })
  }

}
