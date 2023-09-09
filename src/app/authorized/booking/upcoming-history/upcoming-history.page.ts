import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { BookingService } from '../booking.service';

@Component({
  selector: 'app-upcoming-history',
  templateUrl: './upcoming-history.page.html',
  styleUrls: ['./upcoming-history.page.scss'],
})
export class UpcomingHistoryPage implements OnInit {
  name2 = 'Bookings';
  @Input() title!: string;
  highlightedName: string = 'Pending';

  isUpcomingClicked: boolean = false;
  isHistoryClicked: boolean = false;

  showUpcomingSection: boolean = true;
  showHistorySection: boolean = false;

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
  ) {}

  

  toggleUpcoming() {
    this.isUpcomingClicked = !this.isUpcomingClicked;
    this.isHistoryClicked = false;
    this.showUpcomingSection = true;
    this.showHistorySection = false;
  }

  toggleHistory() {
    this.isHistoryClicked = !this.isHistoryClicked;
    this.isUpcomingClicked = false;
    this.showUpcomingSection = false;
    this.showHistorySection = true;
  }

 

  ngOnInit() {}
}
