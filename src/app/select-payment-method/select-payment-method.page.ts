import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-select-payment-method',
  templateUrl: './select-payment-method.page.html',
  styleUrls: ['./select-payment-method.page.scss'],
})
export class SelectPaymentMethodPage implements OnInit {

  name = "Select Payment Method";

  methods = [
    {
      heading: 'Debit or Credit card', method: [
        {
          imgSource: 'assets/icon/select-payment-method/card.svg',
          name: 'Add a card'
        }
      ]
    },
    {
      heading: 'Wallet', method: [
        {
          imgSource: 'assets/icon/select-payment-method/paytm.png',
          name: 'Paytm'
        },
        {
          imgSource: 'assets/icon/select-payment-method/amazon-pay.png',
          name: 'Amazon Pay'
        }
      ]
    },
    {
      heading: 'UPI', method: [
        {
          imgSource: 'assets/icon/select-payment-method/paytm.png',
          name: 'Paytm'
        },
        {
          imgSource: 'assets/icon/select-payment-method/phonepe.png',
          name: 'PhonePe'
        },
        {
          imgSource: 'assets/icon/select-payment-method/phonepe.png',
          name: 'Pay via another UPI ID'
        }
      ]
    },
    {
      heading: 'Other Option', method: [
        {
          imgSource: 'assets/icon/select-payment-method/card.svg',
          name: 'Cash on Delivery'
        }
      ]
    },
  ];

  constructor() { }

  ngOnInit() {
  }

}
