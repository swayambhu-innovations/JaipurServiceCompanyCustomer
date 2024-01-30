import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AddressService } from '../../authorized/db_services/address.service';
import { Address } from 'src/app/authorized/select-address/address.structure';
import { DataProviderService } from 'src/app/core/data-provider.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home-header',
  templateUrl: './home-header.component.html',
  styleUrls: ['./home-header.component.scss'],
})
export class HomeHeaderComponent  implements OnInit {
  addressess:Address[] = [];
  @ViewChild('addressModal') addressModal;
  showmodal: boolean = false;
  @Input() MAX_ADDRESS_LINE_LENGTH!:number;
  @Input() showUnreadNotification: boolean = false;
  // addressLine:string = "Nehru Rd, Vile Parle East, Mumbai"
  mainAddressLine:string = '';
  // main address line one is the input address line provided by the database where as the address line 1 and 2 are calculated by the client side depending upn the address character length
  addressLineOne:string = ''
  addressLineTwo:string = ''
  // this toggle is used to show the address line 2
  addressLineTwoVisible:boolean = false;
  insertAddressAccordionButton:boolean = false;
  selectedAddress: Address | undefined;
  initialBreakpointAddress:any = 0.25;
  constructor( private router:Router, public addressService:AddressService, public dataProvider:DataProviderService,
    private loadingController:LoadingController) {
      this.addressService.fetchedAddresses
    .subscribe(async (address:Address[])=>{
      this.addressess = address;
      this.setupAddress(address);
    });
  }

  notification(){
  this.router.navigate(['authorized/notification']);
  }
 
  ngOnInit() {
    
  }

  setupAddress(address){
    if(address.length > 0){
      let currentAddress = address.filter(add=>add.isDefault);
      this.selectedAddress = currentAddress[0];
      this.mainAddressLine = currentAddress[0].addressLine1 + ', ' + currentAddress[0].cityName + ', ' + currentAddress[0].pincode;
      this.addressLineOne = this.mainAddressLine;
      this.insertAddressAccordionButton = true;
      if(this.mainAddressLine.length > this.MAX_ADDRESS_LINE_LENGTH){
        this.addressLineOne = this.mainAddressLine.slice(0,this.MAX_ADDRESS_LINE_LENGTH);
        this.addressLineTwo = this.mainAddressLine.slice(this.MAX_ADDRESS_LINE_LENGTH,this.mainAddressLine.length);
      }
    }
    else{
      this.router.navigateByUrl('authorized/new-address', { state: {isfirstTime: true,isEdit:true} });
    }
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
    this.addressLineTwoVisible = false;
    this.showmodal = false;
    this.MAX_ADDRESS_LINE_LENGTH = 30;
  }

  setopen(){
    //this.addressLineTwoVisible = true;
    this.router.navigate(['/authorized/select-address']);
  }

  onWillDismiss(event){
    this.addressLineTwoVisible = false;
    this.showmodal = false;
    this.MAX_ADDRESS_LINE_LENGTH = 30;
  }
  
  navigate(){
    setTimeout(() => {
      this.router.navigate(['/authorized/new-address']);
    }, 10);
    this.addressLineTwoVisible = false;
    this.showmodal = false;
    this.MAX_ADDRESS_LINE_LENGTH = 30;
    this.addressService.action.next({isEdit:false});
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
    this.addressLineTwoVisible = false;
    this.showmodal = false;
    this.MAX_ADDRESS_LINE_LENGTH = 30;
    this.addressService.action.next({isEdit:true,data:address});
    setTimeout(() => {
      this.router.navigate(['/authorized/new-address']);
    }, 10);
    
  }
}
