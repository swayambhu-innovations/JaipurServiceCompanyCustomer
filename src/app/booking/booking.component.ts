import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
})
export class BookingComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}
  CustomerReview = [
    {
      Name: "Vikas Rajput",
      review: "Excellent Service",
      date: "12 Jan, 2023",
      Comment: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Excellent service 👍"
    },
    {
      Name: "Vikas Rajput",
      review: "Excellent Service",
      date: "12 Jan, 2023",
      Comment: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Excellent service 👍"
    },
    {
      Name: "Vikas Rajput",
      review: "Excellent Service",
      date: "12 Jan, 2023",
      Comment: "4517 Washington Ave. Manchester, Kentucky 39495"
    },
  ]
}
