import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { BookingService } from '../booking.service';
import Utils from '../../common/util';
import * as moment from 'moment';

@Component({
  selector: 'app-upcoming-history',
  templateUrl: './upcoming-history.page.html',
  styleUrls: ['./upcoming-history.page.scss'],
})
export class UpcomingHistoryPage implements OnInit {
  utils:any;
  name2 = 'Bookings';
  @Input() title!: string;
  highlightedName: string = 'Pending';
  bookings:any[] = [];
  filteredBookings:any[] = [];

  visibilityMode:'upcoming'|'history' = 'upcoming';

  // Upcoming data
  data = [
    {
      img: 'assets/ac.svg',
      title: 'AC Installation',
      amount: '₹1502',
      id: 'Booking ID: #D-571224',
      status: 'Status',
      confirm: 'Confirmed',
      date: '8:00-9:00 AM, 09 Dec',
      schedule: 'Schedule',
      name: 'Vijay Gopal',
      role: 'Technician',
      call: 'assets/Call.svg',
      scheduleicon: 'assets/Icon- Outline.svg',
      profile: 'assets/Vijay1.svg',
    },
    {
      img: 'assets/deep.svg',
      title: 'Deep House Cleaning',
      amount: '₹1502',
      id: 'Booking ID: #D-571224',
      status: 'Status',
      confirm: 'Pending',
      date: '8:00-9:00 AM, 09 Dec',
      schedule: 'Schedule',
      scheduleicon: 'assets/Icon- Outline.svg',
    },
  ];

  // History data
  historyData = [
    {
      img: 'assets/ac.svg',
      title: 'AC Installation',
      amount: '₹1502',
      id: 'Booking ID: #D-571224',
      status: 'Status',
      confirm: 'Completed',
      name: 'Manish Gohil',
      time: '8:00 AM',
    },
    {
      img: 'assets/deep.svg',
      title: 'Deep House Cleaning',
      amount: '₹1502',
      id: 'Booking ID: #D-571224',
      status: 'Status',
      confirm: 'Cancelled',
      name: 'Manish Gohil',
      time: '10:00 AM',
    },
  ];

  constructor(
    private router: Router,
    private alertController: AlertController,
    public bookingService:BookingService
  ) {
    this.utils = Utils.stageMaster;
    this.bookings = this.bookingService.bookings;
    this.bookingService.bookingsSubject.subscribe(bookings=> {
      this.bookings = bookings;
    });
    this.filteredBookings = [...this.bookings];
  }

  
  ngOnInit() {
    this.changeVisibility(this.visibilityMode);
  }

  ionViewWillEnter(){
    this.visibilityMode = 'upcoming';
    this.changeVisibility(this.visibilityMode);
  }

  changeVisibility(visibility: 'upcoming'|'history') {
    this.visibilityMode = visibility;
    this.filteredBookings = this.bookings.filter((booking) => {
      if (visibility === 'upcoming') {
        return this.isFutureDate(new Date(booking.timeSlot.date.seconds * 1000), booking.stage);
      } else {
        return !this.isFutureDate(new Date(booking.timeSlot.date.seconds * 1000), booking.stage);
      }
    });
  }

  isFutureDate(date: Date|undefined,stage) {
    //if (!date) return false;
    if(stage == 'expired' || stage == 'discarded' || stage == 'cancelled' || stage == 'completed'){
      return false;
    }
    else{
      return true;
    }

    // return true if date is of tomorrow or later
    // let maxTimeToday = new Date();
    // maxTimeToday.setHours(23, 59, 59, 999);
    // return date > maxTimeToday;
  }

  isPastDate(date: Date|undefined,stage) {
    if(stage == 'expired' || stage == 'discarded' || stage == 'cancelled' || stage == 'completed') return true;
    if (!date) return false;
    // return true if date is of yesterday or earlier
    return date < new Date();
  }
}
