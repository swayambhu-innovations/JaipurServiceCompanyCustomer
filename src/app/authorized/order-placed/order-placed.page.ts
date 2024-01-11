import { Component, OnInit } from '@angular/core';
import { DataProviderService } from 'src/app/core/data-provider.service';

@Component({
  selector: 'app-order-placed',
  templateUrl: './order-placed.page.html',
  styleUrls: ['./order-placed.page.scss'],
})
export class OrderPlacedPage implements OnInit {
  name = 'Order Placed';
  successLogo = 'assets/icon/order-placed/booked.svg';

  paymentFailedLogo = 'assets/icon/order-placed/unbooked.svg'
  
  slotStartTime:Date|undefined;
  slotEndTime:Date|undefined;

  services = [
    {
      img: 'assets/icon/order-placed/ac.svg',
      head: 'AC Installation',
      body: '1 Ton -1.5 Ton x2',
      amount: '₹1502'
    },
    {
      img: 'assets/icon/order-placed/cleaning.svg',
      head: 'Deep House Cleaning',
      body: '2BHK',
      amount: '₹2999'
    }
  ];

  dateNtime = [
    {
      img: 'assets/icon/order-placed/calendar.svg',
      head: 'Date', body: 'November 7,2023'
    },
    {
      img: 'assets/icon/order-placed/clock.svg',
      head: 'Time', body: '12:00-01:00 PM'
    }
  ];
  constructor(public dataProvider:DataProviderService) { 
    this.slotStartTime = dataProvider.currentBooking?.timeSlot?.time?.startTime?.toDate();
    this.slotEndTime = dataProvider.currentBooking?.timeSlot?.time?.endTime?.toDate();
    // console.log(this.slotTime);
  }

  ngOnInit() {
    console.log("currentBooking............:",this.dataProvider.currentBooking);
  }
}
