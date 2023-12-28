import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BookingService } from '../booking.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Booking } from '../booking.structure';
import { LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.page.html',
  styleUrls: ['./booking-details.page.scss'],
})
export class BookingDetailsPage implements OnInit {
  orderId: string;
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
  currentBooking:Booking|undefined;
  CancelForm!: FormGroup;
  jobTimeBeforMins:number = 0;
  constructor(private bookingService:BookingService, private activatedRoute:ActivatedRoute,private router:Router, private loadingController: LoadingController) {
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
          this.jobOtp = [...booking.jobOtp]
          console.log("current booking ..........: ",this.jobOtp, this.currentBooking);
          let timeSlotInSec =this.currentBooking?.timeSlot?.time.startTime.seconds || 0;
          let currenttimeSlotInSec =( new Date().getTime()/1000);
           this.jobTimeBeforMins = (timeSlotInSec - currenttimeSlotInSec)/60;
          console.log("current timeSlot ..........: ",this.jobTimeBeforMins,this.currentBooking);
          this.currentBooking?.services.forEach(service=>{
            service.variants.forEach(variant=>{
              console.log("jobDuration",this.duration,variant.jobDuration,variant.quantity)
              duration += variant.jobDuration * variant.quantity; 
            });
          });
       
          this.duration =  Math.floor( duration/60 )+ " Hour "+    duration%60 + " Minutes";
          if(booking.assignedAgent){
            this.bookingService.getAgentDetails(booking.assignedAgent).subscribe((agentDetails:any)=>{
              console.log("agentDetails.......:",agentDetails)
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

    this.CancelForm = new FormGroup({
      'CancelOptions': new FormControl(getCheckedRadio, [Validators.required])
    })

  }

  RADIO_LIST = [
    { name: 'Hired someone else outside Jaip...', value: '100CP', checked: false },
    { name: 'Service no longer required', value: '101TR', checked: false },
    { name: 'Professional not assigned', value: '102MO', checked: false },
    { name: 'Booking address is incorrect', value: '103BE', checked: false },
   
  ];
  services = [
    {
      img: 'assets/ac.svg',

      head: 'AC Installation',

      body: '1 Ton -1.5 Ton x2',

      amount: '₹1502',
    },

    {
      img: 'assets/cleaning.svg',

      head: 'Deep House Cleaning',

      body1: '2BHK',

      amount: '₹2999',
    },
  ];
  rating = [
    {
      img: 'assets/deep1.svg',

      head1: 'Deep House Cleaning',

      body1: '2BHK',

      amount: '₹2999',

      star: 'assets/star-filled.svg',
      star1: 'assets/star-filled.svg',

      rate: 'You Rated',
    },
    {
      img: 'assets/blueac.svg',

      head2: 'AC Installation',

      body: '1 Ton -1.5 Ton x2',

      amount: '₹1502',

      star: 'assets/star-filled.svg',
      star1: 'assets/star-filled.svg',

      rate: 'Rate This Services',
    },
  ];

  dateNtime = [
    {
      img: 'assets/calendar.svg',

      head: 'Date',
      body: 'November 7,2023',
    },

    {
      img: 'assets/clock.svg',

      head: 'Time',
      body: '12:00-01:00 PM',
    },
  ];

  images = [
    "https://placehold.co/70x70",
    "https://placehold.co/70x70",
    "https://placehold.co/70x70",
    "https://placehold.co/70x70",
    "https://placehold.co/70x70"
  ]


}
