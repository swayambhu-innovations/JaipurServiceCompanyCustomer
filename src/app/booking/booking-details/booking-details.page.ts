import { Component, OnInit } from '@angular/core';

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

  constructor() {
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

  ngOnInit() {}
}
