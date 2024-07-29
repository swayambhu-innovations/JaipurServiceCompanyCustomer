import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AddressService } from '../../authorized/db_services/address.service';
import { Address } from 'src/app/authorized/select-address/address.structure';
import { DataProviderService } from 'src/app/core/data-provider.service';
import { LoadingController } from '@ionic/angular';
// import { MatDialog } from '@angular/material/dialog';
import { ModalController } from '@ionic/angular';
import { CartPage } from 'src/app/authorized/cart/cart.page';
import { SelectAddressPage } from 'src/app/authorized/select-address/select-address.page';
import { ProfilePage } from 'src/app/authorized/profile/profile.page';

@Component({
  selector: 'app-home-header',
  templateUrl: './home-header.component.html',
  styleUrls: ['./home-header.component.scss'],
})
export class HomeHeaderComponent implements OnInit {
  addressess: Address[] = [];
  width: any;

  @ViewChild('addressModal') addressModal;
  showmodal: boolean = false;
  @Input() MAX_ADDRESS_LINE_LENGTH!: number;
  @Input() showUnreadNotification: boolean = false;
  // addressLine:string = "Nehru Rd, Vile Parle East, Mumbai"
  mainAddressLine: string = '';
  // main address line one is the input address line provided by the database where as the address line 1 and 2 are calculated by the client side depending upn the address character length
  addressLineOne: string = '';
  addressLineTwo: string = '';
  // this toggle is used to show the address line 2
  addressLineTwoVisible: boolean = false;
  insertAddressAccordionButton: boolean = false;
  selectedAddress: Address | undefined;
  initialBreakpointAddress: any = 0.25;
  cart: any;

  deviceInfo: any;
  isWebModalOpen: boolean = false;
  mobileView: boolean = true;

  constructor(
    private router: Router,
    // public dialog: MatDialog,
    private modalController: ModalController,
    public addressService: AddressService,
    public dataProvider: DataProviderService,
    private loadingController: LoadingController
  ) {
    // this.addressService.fetchedAddresses.subscribe(
    //   async (address: Address[]) => {
    //   }s
    // );
    // this.addressess = dataProvider.authLessAddress;
    // dataProvider.authLessAddress.geometry.location =
    //   dataProvider.authLessAddress.geometry.location.toJSON();
    this.setupAddress(dataProvider.authLessAddress);
    // console.log(this.addressess);
  }

  notification() {
    this.router.navigate(['authorized/notification']);
  }

  async openCart() {
    this.router.navigate(['authorized/cart/all/all']);
  }

  async user() {
    this.router.navigate(['authorized/profile']);
  }

  login() {
    this.router.navigate(['unauthorized/login']);
  }

  navigateTOSearch() {
    this.router.navigate(['authorized/search']);
  }

  ngOnInit() {
    this.width = window.innerWidth;
    this.systeminfo();
  }

  setupAddress(currentAddress: google.maps.GeocoderResult) {
    if (currentAddress) {
      let add1: string = '',
        add2: string = '',
        city: string = '',
        pinCode: string = '';

      this.selectedAddress = this.dataProvider.authLessAddress;
      currentAddress.address_components.map((comp) => {
        if (comp.types.includes('premise')) add1 = comp.long_name;
        if (comp.types.includes('neighborhood')) add2 = comp.long_name;
        if (comp.types.includes('locality')) city = comp.long_name;
        if (comp.types.includes('postal_code')) pinCode = comp.long_name;
      });
      this.mainAddressLine = add1 + ', ' + add2 + ', ' + city + ', ' + pinCode;
      this.addressLineOne = this.mainAddressLine;
      this.insertAddressAccordionButton = true;
      console.log(currentAddress);
      if (this.mainAddressLine.length > this.MAX_ADDRESS_LINE_LENGTH) {
        this.addressLineOne = this.mainAddressLine.slice(
          0,
          this.MAX_ADDRESS_LINE_LENGTH
        );
        this.addressLineTwo = this.mainAddressLine.slice(
          this.MAX_ADDRESS_LINE_LENGTH,
          this.mainAddressLine.length
        );
      }
    } else {
      this.router.navigateByUrl('fetch-address');
    }
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
      let ass = await this.addressService.getAddresses(
        this.dataProvider.currentUser?.user.uid
      );

      ass.map((res) => {
        let address_ = res.data();
        if (address.name === address_.name) {
          addressId = res.id;
        }
        if (address_.isDefault) {
          address_.isDefault = false;
          this.addressService.editAddress(userId, res.id, address_);
        }
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
    this.addressLineTwoVisible = false;
    this.showmodal = false;
    this.MAX_ADDRESS_LINE_LENGTH = 30;
  }

  async setopen() {
    if (this.dataProvider.currentUser)
      this.router.navigate(['/authorized/select-address']);
    else {
      let currentPosition = this.dataProvider.authLessAddress.geometry.location.toJSON();
      this.router.navigate(['/fetch-address/gps-map', currentPosition]);
    }
  }

  onWillDismiss(event) {
    this.addressLineTwoVisible = false;
    this.showmodal = false;
    this.MAX_ADDRESS_LINE_LENGTH = 30;
  }

  navigate() {
    setTimeout(() => {
      this.router.navigate(['/authorized/new-address']);
    }, 10);
    this.addressLineTwoVisible = false;
    this.showmodal = false;
    this.MAX_ADDRESS_LINE_LENGTH = 30;
    this.addressService.action.next({ isEdit: false });
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
    this.addressLineTwoVisible = false;
    this.showmodal = false;
    this.MAX_ADDRESS_LINE_LENGTH = 30;
    this.addressService.action.next({ isEdit: true, data: address });
    setTimeout(() => {
      this.router.navigate(['/authorized/new-address']);
    }, 10);
  }

  systeminfo() {
    if (this.dataProvider.deviceInfo.deviceType === 'desktop') {
      this.isWebModalOpen = true;
      this.mobileView = false;
    }
  }
}
