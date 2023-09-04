import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reschedule',
  templateUrl: './reschedule.page.html',
  styleUrls: ['./reschedule.page.scss'],
})
export class ReschedulePage implements OnInit {
name = "Reschedule";


  constructor() { }

  ngOnInit() {
  }

  firstBtns = [
    { date: '22', day: 'Mon' },
    { date: '23', day: 'Tue' },
    { date: '24', day: 'Wed' },
    { date: '25', day: 'Thu' },
    { date: '26', day: 'Fri' }];

  secondBtns = [
    { time: '10:00', meridian: 'AM' },
    { time: '11:00', meridian: 'AM' },
    { time: '12:00', meridian: 'PM' },
    { time: '1:00', meridian: 'PM' },
    { time: '2:00', meridian: 'PM' },
    { time: '3:00', meridian: 'PM' },
    { time: '4:00', meridian: 'PM' },
    { time: '5:00', meridian: 'PM' },
    { time: '6:00', meridian: 'PM' },
    { time: '7:00', meridian: 'PM' },
  ]
}
