import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AddressService } from './address.service';
import { DataProviderService } from 'src/app/core/data-provider.service';

@Component({
  selector: 'app-select-address',
  templateUrl: './select-address.page.html',
  styleUrls: ['./select-address.page.scss'],
})
export class SelectAddressPage implements OnInit {

  constructor(private router:Router, public addressService:AddressService, public dataProvider:DataProviderService) { }
  newAddress(){
    this.router.navigate(['new-address'])
  }

  ngOnInit() {
  }

  setValue(event:any){
    console.log(" set address Event",event);
    this.dataProvider.currentBooking!.address = event.detail.value;
  }

  Address = [
    {
      profile: "Arpita",
      number: "9125332151",
      Addres: "4517 Washington Ave. Manchester, Kentucky 39495"
    },
    {
      profile: "Arpita",
      number: "9125332151",
      Addres: "4517 Washington Ave. Manchester, Kentucky 39495"
    },
  ]
}
