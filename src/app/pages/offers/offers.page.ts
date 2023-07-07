import { Component, OnInit } from '@angular/core';
import { SharedArrayService } from '../../shared-array.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {

  coupons = this.sharedArrayService.getCoupons();
  appliedCoupons=this.sharedArrayService.getAppliedCoupons();

  onApplyClick(coopen:any) {
    this.pushToAppliedCoupons(coopen);
    this.router.navigate(['/cart']);
  }

  pushToAppliedCoupons(coopen:any){
    this.appliedCoupons.push(coopen);
    this.sharedArrayService.setAppliedCoupons(this.appliedCoupons);
  }

constructor(private router: Router,private sharedArrayService: SharedArrayService) {}

  ngOnInit() {
  }

}
