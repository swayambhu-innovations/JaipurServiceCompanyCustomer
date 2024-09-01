import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AddressService } from '../db_services/address.service';
import { DataProviderService } from 'src/app/core/data-provider.service';
import { Address } from './address.structure';
import { LoadingController, ModalController } from '@ionic/angular';
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'app-select-address',
  templateUrl: './select-address.page.html',
  styleUrls: ['./select-address.page.scss'],
})
export class SelectAddressPage implements OnInit {
  temp: any = {};
  addressLineTwoVisible: boolean = false;
  address: any = this.dataProvider.authLessAddress;
  deviceinfo: any;
  isModalOpen: boolean = false;
  mobileView: boolean = false;
  @ViewChild(IonModal) modal: IonModal;

  constructor(
    private router: Router,
    public addressService: AddressService,
    public dataProvider: DataProviderService,
    private loadingController: LoadingController,
    private viewController: ModalController
  ) {}

  newAddress() {
    this.addressService.action.next({ isEdit: false });
    this.router.navigate(['/authorized/new-address']);
  }

  ngOnInit() {}

  ionViewDidEnter() {
    this.systeminfo();
    this.address = JSON.parse(localStorage.getItem('address')!);
    console.log(this.address);
    let add1: string = '',
      add2: string = '',
      city: string = '',
      pinCode: string = '';
    this.address.address_components.map((comp) => {
      if (comp.types.includes('premise')) add1 = comp.long_name;
      if (comp.types.includes('neighborhood')) add2 = comp.long_name;
      if (comp.types.includes('locality')) city = comp.long_name;
      if (comp.types.includes('postal_code')) pinCode = comp.long_name;
    });
    this.address.name = 'Home';
    this.address.addressLine1 = add1 + ', ' + add2 + ', ' + city;
    this.address.pincode = pinCode;
  }

  back() {
    this.viewController.dismiss();
  }

  ionViewDidLeave() {
    this.isModalOpen = false;
  }

  systeminfo() {
    if (this.dataProvider.deviceInfo.deviceType === 'desktop') {
      this.isModalOpen = true;
      this.mobileView = false;
    }
    if (this.dataProvider.deviceInfo.deviceType === 'mobile') {
      this.mobileView = true;
      this.isModalOpen = false;
    }
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
    // this.addressService.action.next({ isEdit: true, data: address });
    this.dataProvider.authLessAddress = null;
    this.router.navigate(['/fetch-address']);
  }

  async changeAddress(address: Address) {
    let addressId = '';
    let userId = '';
    let loader = await this.loadingController.create({
      message: 'Changing  Location...',
    });
    loader.present();
    if (this.dataProvider.currentUser?.user.uid) {
      userId = this.dataProvider.currentUser?.user.uid;
      await this.addressService
        .getAddresses2(this.dataProvider.currentUser?.user.uid)
        .then((addressRequest) => {
          const addresses = addressRequest.docs.map((notification: any) => {
            return { ...notification.data(), id: notification.id };
          });
          addresses.map((res) => {
            if (address.id === res.id) {
              addressId = res.id;
            }
            if (res.isDefault) {
              res.isDefault = false;
              this.addressService.editAddress(userId, res.id, res);
            }
          });
        });
    }
    if (userId !== '' && addressId !== '') {
      address.isDefault = true;
      this.addressService.editAddress(userId, addressId, address);
      loader.dismiss();
      this.addressService.clearCart(userId).then(() => {});
    } else {
      loader.dismiss();
    }
  }
}
