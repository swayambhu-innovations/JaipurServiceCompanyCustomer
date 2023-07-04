import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
          imgSource: 'assets/icon/select-payment-method/upi.png',
          name: 'Pay via another UPI ID'
        }
      ]
    },
    {
      heading: 'Other Option', method: [
        {
          imgSource: 'assets/icon/select-payment-method/cod.png',
          name: 'Cash on Delivery'
        }
      ]
    },
  ];

  constructor(
    private router:Router
  ) { }

  ngOnInit() {
  }

  confirmBookingNavigate(){
    this.router.navigate(['/confirm-booking']);
  }

}
