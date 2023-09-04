import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';


import { NumberFormatStyle } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  constructor(private https:HttpClient,private alertify:AlertsAndNotificationsService) { }
  WindowRef: any;
  orders: any[] = [];

  get MainWindowRef() {
    return this.WindowRef;
  }

  generateRecipetNumber(){
    return `Receipt#${Math.floor(Math.random() * 5123 * 43) + 10}`;
  }
  
  handleWallet(amount:number){
    console.log(amount);
    this.WindowRef = window;
    var result:Subject<any> = new Subject();
      var ref = this;
      function preparePaymentDetails(order: any, orderDetails: any,result:Subject<any>) {
        return {
          key: environment.RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
          amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 29935 refers to 29935 paise or INR 299.35.
          name: 'Pay',
          currency: order.currency,
          order_id: order.id, //This is a sample Order ID. Create an Order using Orders API. (https://razorpay.com/docs/payment-gateway/orders/integration/#step-1-create-an-order). Refer the Checkout form table given below
          image: 'https://madhavseva.com/assets/Images/logo.png',
          handler: function (response: any) {
            ref.finalizePayment(response,result);
          },
          // prefill: {
          //   name: this.dataProvider.user.name,
          //   contact: '+91' + orderDetails.user.phone,
          // },
          theme: {
            color: '#ffc670',
          },
        };
      }
      let orderDetails = {
        amount: amount * 100,
        receipt: this.generateRecipetNumber(),
      };
      console.log("Order details",orderDetails);
      this.createOrder(orderDetails).subscribe((order) => {
          console.log("Payment details",order)
          let orderDetail = preparePaymentDetails(order, amount,result)
          var rzp1 = new this.WindowRef.Razorpay(orderDetail);
          this.orders.push(orderDetail);
          rzp1.open();
          result.next({...orderDetails,stage:"paymentGatewayOpened"})
        },
        (error) => {
          console.log(error.message, "error");
          result.next({...orderDetails,stage:"paymentGatewayError"})
        },
        ()=>{
          // completed
          result.next({...orderDetails,stage:"paymentGatewayClosed"})
        }
      )
      return result
  }

  handlePayment(data:booking){
    console.log(data);
    this.WindowRef = window;
    var result:Subject<any> = new Subject();
      var ref = this;
      function preparePaymentDetails(order: any, orderDetails: booking,result:Subject<any>) {
        return {
          key: environment.RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
          amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 29935 refers to 29935 paise or INR 299.35.
          name: 'Pay',
          currency: order.currency,
          order_id: order.id, //This is a sample Order ID. Create an Order using Orders API. (https://razorpay.com/docs/payment-gateway/orders/integration/#step-1-create-an-order). Refer the Checkout form table given below
          image: 'https://madhavseva.com/assets/Images/logo.png',
          handler: function (response: any) {
            ref.finalizePayment(response,result);
          },
          prefill: {
            name: orderDetails.user.displayName,
            contact: '+91' + orderDetails.user.phone,
          },
          theme: {
            color: '#ffc670',
          },
        };
      }
      let orderDetails = {
        amount: Math.round(data.grandTotal! * 100),
        receipt: this.generateRecipetNumber(),
      };
      console.log("Order details",orderDetails);
      this.createOrder(orderDetails).subscribe((order) => {
          console.log("Payment details",order)
          let orderDetail = preparePaymentDetails(order, data,result)
          var rzp1 = new this.WindowRef.Razorpay(orderDetail);
          this.orders.push(orderDetail);
          rzp1.open();
          result.next({...orderDetails,stage:"paymentGatewayOpened"})
        },
        (error) => {
           console.log(error.message, "error");
          result.next({...orderDetails,stage:"paymentGatewayError"})
        },
        ()=>{
          // completed
          result.next({...orderDetails,stage:"paymentGatewayClosed"})
        }
      )
      return result
  }
  handleSubscription(response: any,result:Subject<any>) {
    this.https.post(
      environment.cloudFunctions.verifySubscription,
      response,
      { responseType: 'json' }
    ).subscribe((res: any) => {
      console.log('Subscription', res);
      if (res.verified == true){
        result.next({...res,response,stage:"paymentCaptureSuccess"})
      } else {
        result.next({...res,response,stage:"paymentCaptureFailed"})
      }
    });
  }

  finalizePayment(response: any,result:Subject<any>) {
    console.log(response);
    this.https.post(
      environment.cloudFunctions.capturePayment,{
      amount: this.orders.find((order) => order.order_id == response.razorpay_order_id).amount,
      payment_id: response.razorpay_payment_id,
    }).subscribe((res: any) => {
      if (res.res.statusCode) {
        console.log("Current order detail",res)
        result.next({...res,stage:"paymentCaptureSuccess"})
      } else {
        console.log('Some error occured please retry your payment. Or please contact +91-9026296062', res);
        result.next({...res,stage:"paymentCaptureFailed"})
      }
    });
  }

  handleSubscriptionPayment(data:paymentDetail){

  }

  createOrder(orderDetails: any) {
    return this.https.post(
      environment.cloudFunctions.createOrder,
      orderDetails
    );
  }
}

import { AlertsAndNotificationsService } from './alerts-and-notifications.service';

export interface paymentDetail extends booking {
    cost: number;
}
export interface booking {
  user:{
    displayName?:string,
    email?:string,
    phone?:string,
  },
  grandTotal:number,
}