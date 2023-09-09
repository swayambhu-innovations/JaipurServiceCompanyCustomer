import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss'],
})
export class BookingsComponent  implements OnInit {

  datas = [
    {
      service: 'Ac Installation',
      price: 1502,
      id: 'D-571224',
      status: 'confirmed',
      schedule: new Date(),
      technician: 'Vijay Gopal'
    },
    {
      service: 'Deep House Cleaning',
      price: 1502,
      id: 'D-571224',
      status: 'completed',
      schedule: new Date(),
    },
    {
      service: 'Ac Installation',
      price: 1502,
      id: 'D-571224',
      status: 'completed',
      schedule: new Date(),
      technician: 'Vijay Gopal'
    },
    {
      service: 'Deep House Cleaning',
      price: 1502,
      id: 'D-571224',
      status: 'pending',
      schedule: new Date(),
      technician: 'Vijay Gopal'
    },
    {
      service: 'Ac Installation',
      price: 1502,
      id: 'D-571224',
      status: 'cancelled',
      schedule: new Date(),
      technician: 'Vijay Gopal'
    },
  ]

  stateData: any
  state: 'upcoming' | 'history' =  'upcoming'


  constructor() { }

  ngOnInit() {
    this.getStateData(this.state)
  }

  getStateData(state: 'upcoming' | 'history'){
    if(state === 'upcoming'){
      this.stateData = this.datas.filter((data) => data.status === 'confirmed' || data.status === 'pending')
    }else{
      this.stateData = this.datas.filter((data) => data.status === 'completed' || data.status === 'cancelled')
    }
    this.state = state
  }

}
