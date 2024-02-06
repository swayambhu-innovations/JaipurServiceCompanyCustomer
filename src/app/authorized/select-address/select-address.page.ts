import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AddressService } from '../db_services/address.service';
import { DataProviderService } from 'src/app/core/data-provider.service';
import { Address } from './address.structure';
import { LoadingController } from '@ionic/angular';
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'app-select-address',
  templateUrl: './select-address.page.html',
  styleUrls: ['./select-address.page.scss'],
})
export class SelectAddressPage implements OnInit {
  temp: any = {};
  addressLineTwoVisible:boolean = false;

  deviceinfo:any;
  isModalOpen:boolean = false;
  mobileView = true;
  @ViewChild(IonModal) modal: IonModal;

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

  ionViewDidEnter(){
    this.systeminfo();
    console.log(this.dataProvider.deviceInfo);
  }

  ionViewDidLeave(){
    this.isModalOpen = false;
    console.log(this.isModalOpen);
    this.modal.dismiss();
    console.log("select address modal dismiss");
  }

   systeminfo(){
    if(this.dataProvider.deviceInfo.deviceType === "desktop"){
      this.isModalOpen = true;
      this.mobileView = false;
    }
    // if(this.dataProvider.deviceInfo.deviceType === "mobile"){
      // this.mobileView = false;
      // this.isModalOpen = false;
    // }
  }

  

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
      let ass =  await this.addressService.getAddresses(this.dataProvider.currentUser?.user.uid);
      
      ass.map(res=>{
        let address_ = res.data();
        if(address.name === address_.name){
          addressId = res.id;
        }
        if(address_.isDefault){
          address_.isDefault = false;
          this.addressService.editAddress(userId, res.id,address_);
        }
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
