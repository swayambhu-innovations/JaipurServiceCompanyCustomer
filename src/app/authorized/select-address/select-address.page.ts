import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AddressService } from '../db_services/address.service';
import { DataProviderService } from 'src/app/core/data-provider.service';

@Component({
  selector: 'app-select-address',
  templateUrl: './select-address.page.html',
  styleUrls: ['./select-address.page.scss'],
})
export class SelectAddressPage implements OnInit {

  temp:any = {};
  constructor(private router:Router, public addressService:AddressService, public dataProvider:DataProviderService) { }
  newAddress(){
    this.router.navigate(['new-address'])
  }

  ngOnInit() {
  }

  setValue(event:any){
    this.dataProvider.currentBooking!.address = event.detail.value;
    console.log(event.detail.value);
  }
}
