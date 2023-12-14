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
  orderDate: string;
  name: string;
  price: string;
  duration: string;
  mrp: string;
  discount: string;
  discountedPrice: string;
  rate: string;

  currentBooking:Booking|undefined;
  CancelForm!: FormGroup;
  constructor(private bookingService:BookingService, private activatedRoute:ActivatedRoute,private router:Router, private loadingController: LoadingController) {
    this.activatedRoute.params.subscribe(async params=>{
      if (params['bookingId']){
        let loader = await this.loadingController.create({message:'Please wait...'});
        loader.present();
        this.bookingService.getBooking(params['bookingId']).subscribe((booking:any)=>{
          this.currentBooking = booking;
          console.log(this.currentBooking);
          loader.dismiss();
        })
      } else {
        alert('No booking id found')
        this.router.navigate(['/authorized/booking/upcoming-history'])
      }
    })
    this.orderId = '#44269776';
    this.orderDate = 'April 21, 2023';
    this.name = 'Mukesh Deshpande';
    this.price = '₹4501';
    this.duration = '2 Hour 30 Minutes';
    this.mrp = '₹3150';
    this.discount = '-₹550';
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


}
