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
    {
      light : '../../../assets/icon/slots/morning1.svg',
      dark : '../../../assets/icon/slots/morning2.svg',
      disabled : '../../../assets/icon/slots/morning3.svg'
    },
    {
      light : '../../../assets/icon/slots/lateMorning1.svg',
      dark : '../../../assets/icon/slots/lateMorning2.svg',
      disabled : '../../../assets/icon/slots/lateMorning3.svg'
    },
    {
      light : '../../../assets/icon/slots/afternoon1.svg',
      dark : '../../../assets/icon/slots/afternoon2.svg',
      disabled : '../../../assets/icon/slots/afternoon3.svg'
    },
    {
      light : '../../../assets/icon/slots/lateafternoon1.svg',
      dark : '../../../assets/icon/slots/lateAfternoon2.svg',
      disabled : '../../../assets/icon/slots/lateafternoon3.svg'
    },
    {
      light : '../../../assets/icon/slots/evening1.svg',
      dark : '../../../assets/icon/slots/evening2.svg',
      disabled : '../../../assets/icon/slots/evening3.svg'
    },
    {
      light : '../../../assets/icon/slots/lateevening1.svg',
      dark : '../../../assets/icon/slots/lateevening2.svg',
      disabled : '../../../assets/icon/slots/lateEvening3.svg'
    },
    {
      light : '../../../assets/icon/slots/night1.svg',
      dark : '../../../assets/icon/slots/night2.svg',
      disabled : '../../../assets/icon/slots/night3.svg'
    }
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
  }
  ionViewDidEnter(){
    let booking = this.dataProvider.currentBooking;
    if(booking?.isUpdateSlot && booking.timeSlot){
      this.selectedDate = booking.timeSlot.date.toDate();
      this.selectedStartTime = booking.timeSlot.time.startTime.toDate();
      this.selectedEndTime = booking.timeSlot.time.endTime.toDate();
    }
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
      console.log("date:",date)
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
    this.selectedDate = this.dates[0];
    this.currentDateNTime.todaydate = (new Date().getDate());
    this.currentDateNTime.currenttime = (new Date()).getHours();
  }

  

  totalSlots() {
    getDocs(collection(this.firestore,'slots')).then((slots) => {
      this.slots = slots.docs.map((slot) => {
        return { ...slot.data(),id: slot.id };
      });
      this.slotsArray = this.slots.sort((a: any, b: any) =>
        a.index > b.index ? 1 : -1
      );
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
    this.selectedTimeState = true;
  }

  async createBooking() {
    
    let loader = await this.loadingController.create({
      message: 'Please wait...',
    });
    loader.present();
    let booking = this.dataProvider.currentBooking;
    if(booking && !booking?.isUpdateSlot){
      booking.createdAt = Timestamp.fromDate(new Date());
        this.bookingService.addBooking(
          this.dataProvider.currentBooking!,
          this.dataProvider.currentUser!.user!.uid
        )
        .then(async () => {
          await this.cartService.deleteBooking(
            this.dataProvider.currentUser!.user.uid,
            this.dataProvider.currentBooking!.id!
          )
          await this.cartService.updateCart();
          this.router.navigate(['/authorized/order-placed']);
        })
        .finally(() => {
          loader.dismiss();
        });
      }else{
        this.bookingService.updateBookingSlot(this.dataProvider.currentUser!.user.uid, this.dataProvider.currentBooking!.id!, this.dataProvider.currentBooking).then(resp=>{
          this.router.navigate(['/authorized/order-placed']);
          loader.dismiss();
        });
      }
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
