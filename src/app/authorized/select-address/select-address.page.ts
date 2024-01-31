import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AddressService } from '../db_services/address.service';
import { DataProviderService } from 'src/app/core/data-provider.service';
import { Address } from './address.structure';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-select-address',
  templateUrl: './select-address.page.html',
  styleUrls: ['./select-address.page.scss'],
})
export class SelectAddressPage implements OnInit {
  temp: any = {};
  addressLineTwoVisible:boolean = false;
  constructor(
    private router: Router,
    public addressService: AddressService,
    public dataProvider: DataProviderService,
    private loadingController:LoadingController
  ) {}

  newAddress() {
    this.addressService.action.next({ isEdit: false });
    this.router.navigate(['/authorized/new-address']);
  }

  ngOnInit() {}

  

  setValue(event: any) {
    this.dataProvider.currentBooking!.address = event.detail.value;
  }
  deleteAddress(address: Address) {
    if (address.isDefault) {
      alert('Default Address cannot be Deleted!');
      return;
    }
    if (confirm('Are you sure you want to delete this address?')) {
      if (this.dataProvider.currentUser?.user.uid)
        this.addressService.deleteAddress(
          this.dataProvider.currentUser?.user.uid,
          address.id
        );
    }
  }
  editAddress(address: Address) {
    this.addressService.action.next({ isEdit: true, data: address });
    this.router.navigate(['/authorized/new-address']);
  }


  async changeAddress(address:Address){
    let addressId = "";
    let userId = "";
    let loader = await this.loadingController.create({message:'Changing  Location...'});
    loader.present();
    if(this.dataProvider.currentUser?.user.uid){
      userId = this.dataProvider.currentUser?.user.uid;
      await this.addressService.getAddresses2(this.dataProvider.currentUser?.user.uid).then((addressRequest) => {
        const addresses = addressRequest.docs.map((notification:any) => {
          return { ...notification.data(),id: notification.id };
        });
        addresses.map(res=>{
          if(address.id === res.id){
            addressId = res.id;
          }
          if(res.isDefault){
            res.isDefault = false;
            this.addressService.editAddress(userId, res.id,res);
          }
        });
      });
    }
    if(userId !== "" && addressId !== ""){
      address.isDefault = true;
      this.addressService.editAddress(userId, addressId,address);
      loader.dismiss();
      this.addressService.clearCart(userId).then(() => {});

    }else{
      loader.dismiss();
    }
  }
}
