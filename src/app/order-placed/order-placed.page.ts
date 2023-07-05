import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-placed',
  templateUrl: './order-placed.page.html',
  styleUrls: ['./order-placed.page.scss'],
})
export class OrderPlacedPage implements OnInit {
  name = 'Order Placed';
  successLogo = 'https://s3-alpha-sig.figma.com/img/5537/8299/f2fb799b4a8072dc62b2f4a80d0c023c?Expires=1689552000&Signature=OOKN~AULEGZfeTY7LQuW5HYwyKFI2HcQVtExi5ZBAk62-BndXswDBUitADoDPPlifeDgPuAlAJXRezPNlS1P-9CRMqGyPP3mbwHqYvbRwqWSYg7jGB-hl-jH5f93ZvBuOUBZ5HrmvDhlWyWwWAwXnl4qKb8IRmbSBcjWgfNydwdUwiFXk5hZztFiH0K~IqYOE3~PF4KzGeoLAfnMFNHCStr3eUEI2j5OtzmAjCwEzHD3nnQGh43DSug~vvj3y3yo7jnfCKreBH3QEIqOwboZpKYJhXVt0kmOjEGN5tTnpbyAcwvxMaYq40XQtFwZlr~bw2jmgo0uJtHTbUtsTQFbog__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4';

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
  constructor() { }

  ngOnInit() {
  }

}
