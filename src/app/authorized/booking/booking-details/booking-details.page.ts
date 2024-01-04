import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BookingService } from '../booking.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Booking } from '../booking.structure';
import { LoadingController } from '@ionic/angular';
import { UserNotificationService } from '../../common/user-notification.service';
import Utils from '../../common/util';
import { DataProviderService } from 'src/app/core/data-provider.service';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.page.html',
  styleUrls: ['./booking-details.page.scss'],
})
export class BookingDetailsPage implements OnInit {
  orderId: string;
   utils: any;
  isModalOpenRate = false;
  orderDate: string;
  name: string;
  price: string;
  assignedAgent:any;
  isModalOpenCancellation:boolean = false;
  duration: string;
  mrp: string;
  discount: number =0;
  discountedPrice: string;
  rate: string;
  jobOtp:any[]=[];
  picAvalable:boolean = false;
  currentBooking:Booking|undefined;
  CancelForm!: FormGroup;
  jobTimeBeforMins:number = 0;
  constructor(private bookingService:BookingService, private activatedRoute:ActivatedRoute,private router:Router, 
    private loadingController: LoadingController,private fb: FormBuilder,private userNotificationService:UserNotificationService,
    private dataProvider:DataProviderService
    ) {
       this.utils = Utils.stageMaster;
    this.activatedRoute.params.subscribe(async params=>{
      let duration = 0;
      if (params['bookingId']){
        let loader = await this.loadingController.create({message:'Please wait...'});
        loader.present();
        this.bookingService.getBooking(params['bookingId']).subscribe((booking:any)=>{
          this.currentBooking = booking;
          if(this.currentBooking?.billing?.coupanDiscunt)
          this.discount = this.currentBooking?.billing?.coupanDiscunt + this.currentBooking?.billing.discount;
          else
          this.currentBooking?.billing.discount;
          if(booking?.jobOtp){
            this.jobOtp = [...booking.jobOtp];
          }
          
          if(this.currentBooking)
           this.picAvalable = this.currentBooking?.picsBefore.length > 0
          let timeSlotInSec =this.currentBooking?.timeSlot?.time.startTime.seconds || 0;
          let currenttimeSlotInSec =( new Date().getTime()/1000);
           this.jobTimeBeforMins = (timeSlotInSec - currenttimeSlotInSec)/60;
          this.currentBooking?.services.forEach(service=>{
            service.variants.forEach(variant=>{
              duration += variant.jobDuration * variant.quantity; 
            });
          });
          console.log("this.currentBooking.......: ",this.currentBooking?.timeSlot?.date.toDate())
          this.duration =  Math.floor( duration/60 )+ " Hour "+    duration%60 + " Minutes";
          if(booking.assignedAgent){
            this.bookingService.getAgentDetails(booking.assignedAgent).subscribe((agentDetails:any)=>{
              this.assignedAgent =agentDetails;
            });
          }
          loader.dismiss();
        });
      } else {
        alert('No booking id found')
        this.router.navigate(['/authorized/booking/upcoming-history'])
      }
    })
    this.orderId = '#44269776';
    this.orderDate = 'April 21, 2023';
    this.name = 'Mukesh Deshpande';
    this.price = '₹4501';
    this.mrp = '₹3150';
    this.discountedPrice = '₹2600';
    this.rate = 'Rate This Services';
    this.rate = 'You Rated';
  }
  ngOnInit(): void {
    
    // Setting default selection in FormControl
    let getCheckedRadio: string | null = null;
    this.RADIO_LIST.forEach(o => {
      if (o.checked)
        getCheckedRadio = o.value;
    })

    this.CancelForm = this.fb.group({
      cancelReason: ['', Validators.required],
      cancelReasonText: ['']
    });

  }

  RADIO_LIST = [
    { name: 'Hired someone else outside Jaipur.', value: '100CP', checked: false },
    { name: 'Service no longer required', value: '101TR', checked: false },
    { name: 'Professional not assigned', value: '102MO', checked: false },
    { name: 'Booking address is incorrect', value: '103BE', checked: false },
   
  ];

  cancelSubmit() {
    if(this.currentBooking){
      this.bookingService.updateBooking(this.currentBooking.currentUser.userId, this.currentBooking.id, Utils.stageMaster.discarded.key, undefined, this.CancelForm.value);
      this.userNotificationService.addAgentNotification(this.currentBooking.currentUser.userId, this.userNotificationService.message.bookingRejected);
    }
    this.isModalOpenCancellation = false;
  }

  rescheduleSubmit(){
    if(this.currentBooking){
      this.currentBooking.isUpdateSlot = true;
      
      if(this.currentBooking.stage =="jobAccepted"){
        this.currentBooking.stage = 'acceptancePending';
      }else{
        this.currentBooking.stage = 'allotmentPending';
      }
    }
    
    this.dataProvider.currentBooking =this.currentBooking;
    this.router.navigate(['/authorized/select-slot']);
  }
  ionModalDidDismiss(event){
    this.isModalOpenCancellation = false;
  }

  onClickCancelBooking(){
    this.isModalOpenCancellation = true;
  }

}
