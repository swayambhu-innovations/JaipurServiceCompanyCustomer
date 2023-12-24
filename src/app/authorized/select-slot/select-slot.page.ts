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
  selectedDate: Date | undefined;

  selectedStartTime: Date | undefined;
  selectedEndTime: Date | undefined;
  selectAgentArrivalTime: Date | undefined;

  dates: Date[] = [];
  times: Date[] = [];
  slots: any[] = [];
  slotsArray: any[] = [];
  selectedTimeState: boolean = false;
  selectedSlot:any;
  startTime: any;
  endTime: any;

  agentArrivalArray: Date[] = [];

  currentDateNTime = {
    todaydate: 0,
    currenttime: 0
  }

  slotsIcons = [
    '../../../assets/icon/slots/morning.svg',
    '../../../assets/icon/slots/lateMorning.svg',
    '../../../assets/icon/slots/afternoon.svg',
    '../../../assets/icon/slots/lateAfternoon.svg',
    '../../../assets/icon/slots/evening.svg',
    '../../../assets/icon/slots/lateEvening.svg',
    '../../../assets/icon/slots/night.svg',
  ];

  slotsStatus = [
    'Morning',
    'lateMorning',
    'Afternoon',
    'LateAfternoon',
    'Evening',
    'LateEvening',
    'Night',
  ];

  constructor(
    private firestore: Firestore,
    public dataProvider: DataProviderService,
    private paymentService: PaymentService,
    private bookingService: BookingService,
    private loadingController: LoadingController,
    private router: Router,
    private cartService: CartService
  ) {
  }

  ngOnInit() {
    // regenrate the slots
    // this.currentTime = (new Date()).getHours();
    this.generateSlots();
    this.totalSlots();
    console.log("sssssssssssss. ",this.dataProvider)
  }

  generateSlots() {
    // fill dates with next 7 days starting from today
    let today = new Date();
    for (let i = 0; i < 5; i++) {
      let date = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + i
      );
      this.dates.push(date);
    }

    // fill times with 8am to 8pm
    for (let i = 9; i <= 10; i++) {
      // let date = new Date(
      //   today.getFullYear(),
      //   today.getMonth(),
      //   today.getDate(),
      //   i
      // );
      // this.times.push(date);
      let t1 = new Date(today.getFullYear(),today.getMonth(),today.getDate(),i);
      this.times.push(t1);
      let t2 = new Date(today.getFullYear(),today.getMonth(),today.getDate(),i, 30);
      this.times.push(t2);
      
    }
    console.log(this.times);
    this.selectedDate = this.dates[0];
    this.currentDateNTime.todaydate = (new Date().getDate());
    this.currentDateNTime.currenttime = (new Date()).getHours();
  }

  

  async totalSlots() {
    await getDocs(collection(this.firestore, 'slots')).then((data) => {
      this.slots = data.docs.map((doc) => {
        return doc.data();
      });
    });

    this.slotsArray = this.slots.sort((a, b) => {
      return a.index - b.index;
    });
  }

  clearSlot(){
    this.startTime = 0;
    this.selectAgentArrivalTime = new Date();
    this.agentArrivalArray = [];
    this.selectedTimeState = false;
  }

  setSlot(slot) {
    let today = new Date();
    
    this.selectedStartTime = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      this.startTime
    );
    this.selectedEndTime = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      this.endTime
    );
    this.selectedSlot = slot;
    console.log(this.startTime + " " + this.endTime);
    this.preferredAgentTime(this.startTime, this.endTime);
  }

  preferredAgentTime(start: any, endTime: any){
    this.agentArrivalArray = [];
    let today1 = new Date();
    
    // for(let i = 0; i < )
    for (let i = start; i < endTime; i++) {
      let t1 = new Date(today1.getFullYear(),today1.getMonth(),today1.getDate(),i);
      this.agentArrivalArray.push(t1);
      let t2 = new Date(today1.getFullYear(),today1.getMonth(),today1.getDate(),i, 30);
      this.agentArrivalArray.push(t2);
    }

    console.log(this.agentArrivalArray);
  }

  setTimeSlot(){
    this.dataProvider.currentBooking!.timeSlot = {
      date: Timestamp.fromDate(this.selectedDate!),
      agentArrivalTime: Timestamp.fromDate(this.selectedEndTime!),
      time: {
        startTime: Timestamp.fromDate(this.selectedStartTime!),
        endTime: Timestamp.fromDate(this.selectedEndTime!),
      },
      id: this.selectedSlot.id
    };
    console.log(this.dataProvider.currentBooking!.timeSlot);
    this.selectedTimeState = true;
  }

  async createBooking() {
    let loader = await this.loadingController.create({
      message: 'Please wait...',
    });
    loader.present();
    this.bookingService
      .addBooking(
        this.dataProvider.currentBooking!,
        this.dataProvider.currentUser!.user!.uid
      )
      .then(async () => {
        await this.cartService.deleteBooking(
          this.dataProvider.currentUser!.user.uid,
          this.dataProvider.currentBooking!.id!
        );
        this.router.navigate(['/authorized/order-placed']);
      })
      .finally(() => {
        loader.dismiss();
      });
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
