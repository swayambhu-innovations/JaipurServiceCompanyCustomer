import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataProviderService } from 'src/app/core/data-provider.service';

@Component({
  selector: 'app-order-placed',
  templateUrl: './order-placed.page.html',
  styleUrls: ['./order-placed.page.scss'],
})
export class OrderPlacedPage implements OnInit {
  name = 'Order Placed';
  successLogo = 'assets/icon/order-placed/booked.svg';
  failiarLogo = 'assets/icon/order-placed/failedpaymentFaild.png';

  paymentFailedLogo = 'assets/icon/order-placed/unbooked.svg'
  
  slotStartTime:Date|undefined;
  slotEndTime:Date|undefined;

  constructor(public dataProvider:DataProviderService,private router: Router) { 
    this.slotStartTime = dataProvider.currentBooking?.timeSlot?.time?.startTime?.toDate();
    this.slotEndTime = dataProvider.currentBooking?.timeSlot?.time?.endTime?.toDate();
  }

  onSelectRetryPayment(){
    this.router.navigateByUrl('/authorized/select-slot', {state: { isRetry: true} });
  }

  ngOnInit() {
  }
}
