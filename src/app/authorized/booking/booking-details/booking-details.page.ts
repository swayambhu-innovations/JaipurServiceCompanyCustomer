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

var pdfMakeX = require('pdfmake/build/pdfmake.js');
var pdfFontsX = require('pdfmake/build/vfs_fonts.js');
pdfMakeX.vfs = pdfFontsX.pdfMake.vfs;
import * as pdfMake from 'pdfmake/build/pdfmake';
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
    private platform: Platform
    ) {
       this.utils = Utils.stageMaster;
    this.activatedRoute.params.subscribe(async params=>{
      let duration = 0;
      if (params['bookingId']){
        let loader = await this.loadingController.create({message:'Please wait...'});
        loader.present();
        this.bookingService.getBooking(params['bookingId']).subscribe((booking:any)=>{
          this.currentBooking = booking;
          this.createPDF(this.currentBooking);
          if(this.currentBooking?.billing?.coupanDiscunt)
          this.discount = this.currentBooking?.billing?.coupanDiscunt + this.currentBooking?.billing.discount;
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

  cancelSubmit() {
    if(this.currentBooking){
      this.bookingService.updateBooking(this.currentBooking.currentUser.userId, this.currentBooking.id, Utils.stageMaster.discarded.key, undefined, this.CancelForm.value);
      this.userNotificationService.addAgentNotification(this.currentBooking.currentUser.userId, this.userNotificationService.message.bookingRejected);
    }
    this.isModalOpenCancellation = false;
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

//   public async downloadInvoice(currentBookingData: any) {
//     const doc = new jsPDF({ filters: ['ASCIIHexEncode'] });
//     autoTable(doc, {
//         body: [
//             [
//                 {
//                     content: 'Jaipur Service Company',
//                     styles: {
//                         halign: 'left',
//                         fontSize: 20,
//                         textColor: '#ffffff',
//                     },
//                 },
//                 {
//                     content: 'Invoice',
//                     styles: {
//                         halign: 'right',
//                         fontSize: 20,
//                         textColor: '#ffffff',
//                     },
//                 },
//             ],
//         ],
//         theme: 'plain',
//         styles: {
//             fillColor: 'rgb(82, 86, 89)',
//         },
//     });
//     autoTable(doc, {
//         body: [
//             [
//                 {
//                     content: 'GSTN: 09IXVPK0011F1ZE',
//                     styles: {
//                         halign: 'left',
//                         fontSize: 13,
//                     },
//                 },
//             ],
//         ],
//         theme: 'plain',
//     });
//     autoTable(doc, {
//         body: [
//             [
//                 {
//                     content:
//                         'From:' +
//                         '\n Jaipur Service Company' +
//                         '\n Shop C-01,409/276-277,' +
//                         '\n Shakuntalam Apartment,' +
//                         '\n Mutthiganj, Near Maya Press' +
//                         '\n 211003 - Prayagraj' +
//                         '\n India',
//                     styles: {
//                         halign: 'left',
//                     },
//                 },
//                 {
//                     content:
//                         'Reference: #' +
//                         currentBookingData?.id +
//                         '\nDate: ' +
//                         new Date(currentBookingData?.completedAt?.seconds * 1000).toLocaleString(),
//                     styles: {
//                         halign: 'right',
//                     },
//                 },
//             ],
//         ],
//         theme: 'plain',
//     });
//     // autoTable(doc, {
//     // body: [
//     //     [
//     //     {
//     //         content:
//     //         'Billed to:' +
//     //             '\n ' +
//     //             currentBookingData?.userDetails?.displayName +
//     //             '\n ' +
//     //             currentBookingData?.userDetails?.email +
//     //             '\n ' +
//     //             currentBookingData?.userDetails?.phone +
//     //             '\n ' +
//     //             currentBookingData?.userDetails?.deliveryAddress.address ||
//     //         '' +
//     //             '\n ' +
//     //             currentBookingData?.userDetails?.deliveryAddress.area ||
//     //         '' +
//     //             '\n ' +
//     //             currentBookingData?.userDetails?.deliveryAddress.landmark ||
//     //         '' +
//     //             '\n ' +
//     //             currentBookingData?.userDetails?.deliveryAddress.pinCode ||
//     //         '',
//     //         styles: {
//     //         halign: 'left',
//     //         },
//     //     },
//     //     {
//     //         content:
//     //         'Pickup address:' +
//     //             '\n ' +
//     //             currentBookingData?.userDetails?.displayName +
//     //             '\n ' +
//     //             currentBookingData?.userDetails?.email +
//     //             '\n ' +
//     //             currentBookingData?.userDetails?.phone +
//     //             '\n ' +
//     //             currentBookingData?.userDetails?.pickupAddress.address ||
//     //         '' +
//     //             '\n ' +
//     //             currentBookingData?.userDetails?.pickupAddress.area ||
//     //         '' +
//     //             '\n ' +
//     //             currentBookingData?.userDetails?.pickupAddress.landmark ||
//     //         '' +
//     //             '\n ' +
//     //             currentBookingData?.userDetails?.pickupAddress.pinCode ||
//     //         '',
//     //         styles: {
//     //         halign: 'right',
//     //         },
//     //     },
//     //     ],
//     // ],
//     // theme: 'plain',
//     // });
//     // autoTable(doc, {
//     // body: [
//     //     [
//     //     {
//     //         content: 'Amount due:',
//     //         styles: {
//     //         halign: 'right',
//     //         fontSize: 14,
//     //         },
//     //     },
//     //     ],
//     //     [
//     //     {
//     //         content: 'INR ' + currentBookingData?.billingDetail?.grandTotal,
//     //         styles: {
//     //         halign: 'right',
//     //         fontSize: 20,
//     //         textColor: '#3366ff',
//     //         },
//     //     },
//     //     ],
//     //     [
//     //     {
//     //         content:
//     //         'Due date: ' +
//     //         currentBookingData?.slot?.date.toDate().toLocaleString(),
//     //         styles: {
//     //         halign: 'right',
//     //         },
//     //     },
//     //     ],
//     // ],
//     // theme: 'plain',
//     // });
//     autoTable(doc, {
//         body: [
//             [
//                 {
//                     content: 'Products & Services',
//                     styles: {
//                         halign: 'left',
//                         fontSize: 14,
//                     },
//                 },
//             ],
//         ],
//         theme: 'plain',
//     });

//     for (const service of currentBookingData.services) {
//         autoTable(doc, {
//             body: [
//                 [
//                     {
//                         content: this.toProperCase(service.name),
//                         styles: {
//                             halign: 'left',
//                             fontSize: 12,
//                         },
//                     },
//                 ],
//             ],
//             theme: 'plain',
//         });
//         autoTable(doc, {
//             head: [['Variant', 'Quantity', 'Price']],
//             body: [
//                 ...service.variants.map((variant: any) => [
//                     variant.name,
//                     variant.quantity,
//                     variant.price
//                 ]),
//             ],
//             theme: 'striped',
//             headStyles: {
//                 fillColor: '#343a40',
//             },
//         });
//     }

//     autoTable(doc, {
//         body: [
//             [
//                 {
//                     content: 'Subtotal:',
//                     styles: {
//                         halign: 'right',
//                     },
//                 },
//                 {
//                     content: 'INR ' + this.roundOff(currentBookingData?.billing.subTotal),
//                     styles: {
//                         halign: 'right',
//                     },
//                 },
//             ],
//             [
//                 {
//                     content: 'Discount:',
//                     styles: {
//                         halign: 'right',
//                     },
//                 },
//                 {
//                     content: 'INR ' + this.roundOff(currentBookingData?.billing.discount),
//                     styles: {
//                         halign: 'right',
//                     },
//                 },
//             ],
//             [
//                 {
//                     content: 'Tax Rate: ',
//                     styles: {
//                         halign: 'right',
//                     },
//                 },
//                 {
//                     content: 'INR ' + this.roundOff(currentBookingData?.billing.tax),
//                     styles: {
//                         halign: 'right',
//                     },
//                 },
//             ],
//             [
//                 {
//                     content: 'Total amount:',
//                     styles: {
//                         halign: 'right',
//                     },
//                 },
//                 {
//                     content: 'INR ' + this.roundOff(currentBookingData?.billing.grandTotal),
//                     styles: {
//                         halign: 'right',
//                     },
//                 },
//             ],
//         ],
//         theme: 'plain',
//     });

//     autoTable(doc, {
//         body: [
//             [
//                 {
//                     content: 'Terms & notes',
//                     styles: {
//                         halign: 'left',
//                         fontSize: 14,
//                     },
//                 },
//             ],
//             [
//                 {
//                     content:
//                         'The mentioned billing is final and non-negotiable. ' +
//                         'This bill is auto generated by system and does not require any signature. ' +
//                         'Please contact us if you have any query and we will be happy to help you.',
//                     styles: {
//                         halign: 'left',
//                     },
//                 },
//             ],
//         ],
//         theme: 'plain',
//     });

//     autoTable(doc, {
//         body: [
//             [
//                 {
//                     content: 'Powered by Shreeva \n shreeva.com',
//                     styles: {
//                         halign: 'center',
//                     },
//                 },
//             ],
//         ],
//         theme: 'plain',
//     });
//     let pdfOutput = doc.output();
    
//     return Filesystem.writeFile({
//         path: `Invoice_${currentBookingData.id}`,
//         data: pdfOutput,
//         directory: Directory.Documents,
//         encoding: Encoding.UTF8,
//     });
//   }

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
        var dd = {
            content: [
                'First paragraph',
                'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines'
            ]
            
        }
        return dd;
    }

}
