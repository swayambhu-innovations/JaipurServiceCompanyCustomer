import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AddressService } from '../db_services/address.service';
import { DataProviderService } from 'src/app/core/data-provider.service';
import { Address } from './address.structure';

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
  deleteAddress(address:Address){
    if(address.isDefault){
      alert("Default Address cannot be Deleted!");
      return;
    }
    if(confirm("Are you sure you want to delete this address?")){
      if(this.dataProvider.currentUser?.user.uid)
      this.addressService.deleteAddress(this.dataProvider.currentUser?.user.uid,address.id);
    }
  }
  editAddress(address:Address){
    this.addressService.action.next({isEdit:true,data:address});
    this.router.navigate(['/authorized/new-address']);
  }
}
