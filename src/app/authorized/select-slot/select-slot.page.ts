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

  selectedStartTime:Date|undefined;
  selectedEndTime:Date|undefined;

  dates:Date[] = [];
  times:Date[] = [];
  slots: any[] = [];
  slotsArray:any [] = [];
  selectedTimeState:boolean = false;

  startTime:any;
  endTime:any;

  slotsIcons = [
    "../../../assets/icon/slots/morning.svg",
    "../../../assets/icon/slots/lateMorning.svg",
    "../../../assets/icon/slots/afternoon.svg",
    "../../../assets/icon/slots/lateAfternoon.svg",
    "../../../assets/icon/slots/evening.svg",
    "../../../assets/icon/slots/lateEvening.svg",
    "../../../assets/icon/slots/night.svg",
  ]

  slotsStatus = [
    "Morning", "lateMorning", "Afternoon", "LateAfternoon", "Evening", "LateEvening", "Night"
  ]

  constructor(private firestore:Firestore,public dataProvider:DataProviderService, private paymentService:PaymentService, private bookingService:BookingService,  private loadingController: LoadingController, private router:Router, private cartService:CartService) { }

  ngOnInit() {
    // regenrate the slots
    console.log()
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
    for(let i=9;i<=13;i++){
      let date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), i);
      this.times.push(date);
    }
  }

  async totalSlots(){
    await getDocs(collection(this.firestore, 'slots')).then((data) => {
      this.slots = data.docs.map((doc) => {
        return doc.data();
      })
    })

    this.slotsArray = this.slots.sort((a,b) => {
      return a.index - b.index;
    })
  }

  // setSlot(){
  //   let today = new Date();
  //   this.selectedTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), this.tempTime);
  //   this.dataProvider.currentBooking!.timeSlot = {
  //     date: Timestamp.fromDate(this.selectedDate!),
  //     time: Timestamp.fromDate(this.selectedTime!)
  //   }
  // }

  setSlot(){
    let today = new Date();
    console.log(this.dataProvider.currentBooking);
    this.selectedStartTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), this.startTime);
    this.selectedEndTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), this.endTime);
    this.dataProvider.currentBooking!.timeSlot = {
      date: Timestamp.fromDate(this.selectedDate!),
      time: {
        startTime: Timestamp.fromDate(this.selectedStartTime!),
        endTime: Timestamp.fromDate(this.selectedEndTime!)
      }
    }
    console.log(this.dataProvider.currentBooking);
    this.selectedTimeState = true;
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






















