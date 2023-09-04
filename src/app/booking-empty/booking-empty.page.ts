import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-booking-empty',
  templateUrl: './booking-empty.page.html',
  styleUrls: ['./booking-empty.page.scss'],
})
export class BookingEmptyPage implements OnInit {
  name = "Bookings";
  constructor() { }

  ngOnInit() {
  }

}
