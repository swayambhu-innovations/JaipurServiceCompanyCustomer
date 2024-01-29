import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BookingService } from '../booking.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Booking } from '../booking.structure';
import { LoadingController } from '@ionic/angular';
import { UserNotificationService } from '../../common/user-notification.service';
import Utils from '../../common/util';
import { DataProviderService } from 'src/app/core/data-provider.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import {File} from "@awesome-cordova-plugins/file";
import { FileOpener } from '@awesome-cordova-plugins/file-opener';
import { Platform } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { PaymentService } from 'src/app/payment.service';
import { CreateRefund } from '../../models/payment.structure';

var pdfMakeX = require('pdfmake/build/pdfmake.js');
var pdfFontsX = require('pdfmake/build/vfs_fonts.js');
pdfMakeX.vfs = pdfFontsX.pdfMake.vfs;
const pdfMake = require('pdfmake/build/pdfmake.js');
@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.page.html',
  styleUrls: ['./booking-details.page.scss'],
})
export class BookingDetailsPage implements OnInit {
    pdfObj: any;
  orderId: string;
   utils: any;
  isModalOpenRate = false;
  orderDate: string;
  name: string;
  price: string;
  assignedAgent:any;
  isModalOpenCancellation:boolean = false;
  duration: string;
  mrp: string;
  refundDetails:any;
  discount: number =0;
  discountedPrice: string;
  rate: string;
  jobOtp:any[]=[];
  picAvalable:boolean = false;
  currentBooking:Booking|undefined;
  CancelForm!: FormGroup;
  jobTimeBeforMins:number = 0;
  constructor(
    private bookingService:BookingService, 
    private activatedRoute:ActivatedRoute,
    private router:Router, 
    private loadingController: LoadingController,
    private fb: FormBuilder,
    private userNotificationService:UserNotificationService,
    private dataProvider:DataProviderService,
    private platform: Platform,
    private paymentService:PaymentService
    ) {
       this.utils = Utils.stageMaster;
    this.activatedRoute.params.subscribe(async params=>{
      let duration = 0;
      if (params['bookingId']){
        let loader = await this.loadingController.create({message:'Please wait...'});
        this.bookingService.getBooking(params['bookingId']).subscribe((booking:any)=>{
          this.currentBooking = booking;
          this.createPDF(this.currentBooking);
          if(this.currentBooking?.billing?.coupanDiscunt)
          this.discount = (+this.currentBooking?.billing?.coupanDiscunt) + (+this.currentBooking?.billing.discount);
          else
          this.currentBooking?.billing.discount;
          if(booking?.jobOtp){
            this.jobOtp = [...booking.jobOtp];
          }
          
          if(this.currentBooking)
           this.picAvalable = this.currentBooking?.picsBefore.length > 0
          let timeSlotInSec =this.currentBooking?.timeSlot?.time.startTime.seconds || 0;
          let currenttimeSlotInSec =( new Date().getTime()/1000);
           this.jobTimeBeforMins = (timeSlotInSec - currenttimeSlotInSec)/60;
          this.currentBooking?.services.forEach(service=>{
            service.variants.forEach(variant=>{
              duration += variant.jobDuration * variant.quantity; 
            });
          });
          this.duration =  duration + " Hour ";
          if(booking.assignedAgent){
            this.bookingService.getAgentDetails(booking.assignedAgent).subscribe((agentDetails:any)=>{
              this.assignedAgent =agentDetails;
            });
          }
          if(this.currentBooking && this.currentBooking?.isPaid){
            if(this.currentBooking?.isRefundInitiated){
              this.paymentService.getRefundDetailsById(this.currentBooking?.refundInitiatedDetails.payment_id,this.currentBooking?.refundInitiatedDetails.id).subscribe({
                next:(response)=>{
                  this.refundDetails = response;
                },
                error(err) {
                 console.error("err.............: ",err)
                },
              });
            }
          }
          loader.dismiss();
        });
      } else {
        alert('No booking id found')
        this.router.navigate(['/authorized/booking/upcoming-history'])
      }
    })
    this.orderId = '#44269776';
    this.orderDate = 'April 21, 2023';
    this.name = 'Mukesh Deshpande';
    this.price = '₹4501';
    this.mrp = '₹3150';
    this.discountedPrice = '₹2600';
    this.rate = 'Rate This Services';
    this.rate = 'You Rated';
    
  }
  ngOnInit(): void {
    
    // Setting default selection in FormControl
    let getCheckedRadio: string | null = null;
    this.RADIO_LIST.forEach(o => {
      if (o.checked)
        getCheckedRadio = o.value;
    })

    this.CancelForm = this.fb.group({
      cancelReason: ['', Validators.required],
      cancelReasonText: ['']
    });
      
  }

  RADIO_LIST = [
    { name: 'Hired someone else outside Jaipur.', value: '100CP', checked: false },
    { name: 'Service no longer required', value: '101TR', checked: false },
    { name: 'Professional not assigned', value: '102MO', checked: false },
    { name: 'Booking address is incorrect', value: '103BE', checked: false },
   
  ];
  ionViewWillEnter(){
   
  }

  cancelSubmit() {
    console.log("this.currentBooking: ",this.currentBooking)
    if(this.currentBooking && this.currentBooking?.isPaid){
      let payload:CreateRefund = {
        payId: this.currentBooking.payment.razorpay_payment_id,
        amount:this.currentBooking.payment.amount
      }
      let this_ = this;
      this.paymentService.createRefund(payload).subscribe({
        next:(response)=>{
          if(this.currentBooking){
            if(this.currentBooking){
              let payload = {...this.CancelForm.value,'isRefundInitiated':true,refundInitiatedDetails:response}
              this.bookingService.updateBooking(this.currentBooking.currentUser.userId, this.currentBooking.id, Utils.stageMaster.discarded.key, undefined, payload);
              this.userNotificationService.addAgentNotification(this.currentBooking.currentUser.userId, this.userNotificationService.message.bookingRejected);
            }
           this.isModalOpenCancellation = false;
          }
        },
        error(err) {
          console.log("err...........: ",err)
          if(this_.currentBooking){
            if(this_.currentBooking){
              let payload = {...this_.CancelForm.value,'isRefundInitiated':true,refundInitiatedDetails:err}
              this_.bookingService.updateBooking(this_.currentBooking.currentUser.userId, this_.currentBooking.id, Utils.stageMaster.discarded.key, undefined, this_.CancelForm.value);
              this_.userNotificationService.addAgentNotification(this_.currentBooking.currentUser.userId, this_.userNotificationService.message.bookingRejected);
            }
            this_.isModalOpenCancellation = false;
          }
        },
      })
    }else{
      if(this.currentBooking){
        this.bookingService.updateBooking(this.currentBooking.currentUser.userId, this.currentBooking.id, Utils.stageMaster.discarded.key, undefined, this.CancelForm.value);
        this.userNotificationService.addAgentNotification(this.currentBooking.currentUser.userId, this.userNotificationService.message.bookingRejected);
      }
     this.isModalOpenCancellation = false;
    }
    
    
  }

  rescheduleSubmit(){
    if(this.currentBooking){
      this.currentBooking.isUpdateSlot = true;
      
      if(this.currentBooking.stage =="jobAccepted"){
        this.currentBooking.stage = 'acceptancePending';
      }else{
        this.currentBooking.stage = 'allotmentPending';
      }
    }
    this.dataProvider.currentBooking =this.currentBooking;
    this.router.navigate(['/authorized/select-slot']);
  }
  ionModalDidDismiss(event){
    this.isModalOpenCancellation = false;
  }

  onClickCancelBooking(){
    this.isModalOpenCancellation = true;
  }

  roundOff(num: number) {
    return Math.round((num + Number.EPSILON) * 100) / 100
  }

    toProperCase = (text: string) => {
        return text.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    async createPDF(currentBooking:any){
        try{
            let docObject = this.getPdfDefination();
            this.pdfObj = pdfMake.createPdf(docObject);
        }
        catch(err){

        }
    }

    downloadPdf(){
        try{
          console.log(this.platform.is('cordova'),this.platform.is('mobile'));
            if(this.platform.is('cordova') || this.platform.is('mobile')){
                this.pdfObj.getBuffer((buffer:any) => {
                    var blob = new Blob([buffer],{type : 'application/pdf'});
                    File.writeFile(File.dataDirectory,`Invoice_${this.currentBooking?.id}`,blob,{replace: true}).then((fileEntry) => {
                        FileOpener.open(File.dataDirectory+`Invoice_${this.currentBooking?.id}`,'application/pdf')
                    })
                });
            }
            else{
                this.pdfObj.download(`Invoice_${this.currentBooking?.id}`);
            }
        }
        catch(err){
      
        }
    }

    getPdfDefination(){
      var dd:any = {
        content: [
          {
              columns: [
                  {
                      text: 'Jaipur Service Company',
                      width: '90%',
                  },
                  {
                      text: 'Invoice',
                      width: '30%',
                  }
              ],
              style: 'header'
              
          },
          {
              text: '\nGSTN: 09IXVPK0011F1ZE\n\n\n',
              fontSize: 13
          },
          {
              columns: [
                    {
                      text: [
                              {
                                  text:'From:\n'
                              },
                              {
                                  text:'Jaipur Service Company\n',
                                  fontSize: 10
                              },
                              {
                                  text:' Shop C-01,409/276-277,\n',
                                  fontSize: 10
                              },
                              {
                                  text:' Shakuntalam Apartment,\n',
                                  fontSize: 10
                              },
                              {
                                  text:' Mutthiganj, Near Maya Press\n',
                                  fontSize: 10
                              },
                              {
                                  text:' 211003 - Prayagraj\n',
                                  fontSize: 10
                              },
                              {
                                  text:' India\n',
                                  fontSize: 10
                              }
                          ],
                          width: '60%'
                          
                    },
                    {
                        text: [
                            {
                                text: `Reference: #${this.currentBooking?.id}\n`
                            },
                            {
                              text: new DatePipe('en-US').transform(this.currentBooking?.timeSlot?.date?.toDate(), 'dd-MMM-yyyy')
                            }
                        ],
                        width: '44%',
                        alignment: 'right'
                    }
              ]
          },
          {
              text: '\n\nProducts & Services',
              fontSize: 16
          },
        ],
        styles: {
          header: {
            fontSize: 22,
            bold: true,
            height:60,
          }
        }
      };
      this.currentBooking?.services.map((item) =>{
        const headingName = {
            text: '\n'+item.name+'\n\n',
            fontSize: 14
        };
        dd.content.push(headingName);
        const serviceContent:any = {
          layout: 'lightHorizontalLines',
          alignment: 'center',
          table: {
            headerRows: 1,
            widths: [ '33%', '33%', '33%'],

            body: [
              [
                  {
                      text: 'Varient',
                      fillColor: '#181f29',
                      color: 'white'
                  },
                  {
                      text: 'Quantity',
                      fillColor: '#181f29',
                      color: 'white'
                  },
                  {
                      text: 'Price',
                      fillColor: '#181f29',
                      color: 'white'
                  }
              
              ]
            ]
          }
        };
        item.variants.map((variant) => {
          const variantItem = [
            {
                text: variant.name,
                color: '#aca6a6'
            },
            {
                text: variant.quantity,
                color: '#aca6a6'
            },
            {
                text: variant.price,
                color: '#aca6a6'
            }
          ];
          serviceContent.table.body.push(variantItem);
        })
        dd.content.push(serviceContent);
      })
      const afterData = [
        {
          text: '\n\n'
        },
        {
        layout: 'noBorders',
        alignment: 'right',
        table: {
          headerRows: 1,
          widths: [ '50%', '50%'],

          body: [
            [
                {text: 'Subtotal:'},
                {text: this.currentBooking?.billing.subTotal},
            ],
            [
                {text: 'Discount:'},
                {text: 'INR '+this.currentBooking?.billing.discount},
            ],
            [
                {text: 'Tax Rate:'},
                {text: 'INR '+this.currentBooking?.billing.tax},
            ]
          ]
        }
      },
      {
          text: '\n\nTerms & notes\n\n',
          fontSize: 14
      },
      {
          text: [
                  'The mentioned billing is final and non-negotiable. This bill is auto generated  by system and does not require any',
                  'signature. Please contact us if you have any query and we will be happy to help you.\n\n\n'
              ]
      },
      
      {
          text: 'Powered by Shreeva',
          alignment: 'center'
          
      },
      {
          text: 'shreeva.com',
          alignment: 'center'
          
      }];
      if(this.currentBooking?.billing?.fixedCharges){
        this.currentBooking?.billing.fixedCharges.map((item:any) =>{
          const serviceContent = [
              {text: item.name},
              {text: 'INR '+item.amount}
          ];
          afterData[1].table?.body.push(serviceContent);
        });
      }
      
      const grandTotalAmount =  [
        {text: 'Total amount:'},
        {text: 'INR '+this.currentBooking?.billing.grandTotal}
      ];
      afterData[1].table?.body.push(grandTotalAmount);
      dd.content = [...dd.content,...afterData];
      return dd;
    }
}
