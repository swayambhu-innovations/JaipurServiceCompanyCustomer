import { Component, Input, OnInit } from '@angular/core';
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
  showmodal: boolean = false;
  @Input() MAX_ADDRESS_LINE_LENGTH!:number;
  // addressLine:string = "Nehru Rd, Vile Parle East, Mumbai"
  mainAddressLine:string = '';
  // main address line one is the input address line provided by the database where as the address line 1 and 2 are calculated by the client side depending upn the address character length
  addressLineOne:string = ''
  addressLineTwo:string = ''
  addressess:Address[] = [];
  // this toggle is used to show the address line 2
  addressLineTwoVisible:boolean = false;
  insertAddressAccordionButton:boolean = false;
  constructor( private router:Router, public addressService:AddressService, public dataProvider:DataProviderService,
    private loadingController:LoadingController) {
  }
   notification(){
    this.router.navigate(['authorized/notification']);
   }
 
  ngOnInit() {
    this.addressService.fetchedAddresses.subscribe((address:Address[])=>{
      if(address.length > 0){
        this.addressess = address;
        let currentAddress = address.filter(add=>add.isDefault);
       // console.log("ngOnInit home header....: ",address[0])
        this.dataProvider.selectedAddress.next(address);
        if(currentAddress.length> 0){
          this.mainAddressLine = currentAddress[0].addressLine1 + ', ' + currentAddress[0].cityName + ', ' + currentAddress[0].pincode;
        }else
        this.mainAddressLine = address[0].addressLine1 + ', ' + address[0].cityName + ', ' + address[0].pincode;
       // console.log(this.mainAddressLine);
        this.MAX_ADDRESS_LINE_LENGTH = this.MAX_ADDRESS_LINE_LENGTH - 3
        if(this.mainAddressLine.length > this.MAX_ADDRESS_LINE_LENGTH){
          this.addressLineOne = this.mainAddressLine.slice(0,this.MAX_ADDRESS_LINE_LENGTH);
          this.addressLineTwo = this.mainAddressLine.slice(this.MAX_ADDRESS_LINE_LENGTH,this.mainAddressLine.length);
          this.insertAddressAccordionButton = true;
        }
      }
      else{
        this.router.navigateByUrl('authorized/new-address', { state: {isfirstTime: true,isEdit:true} });
      }
    })
    this.MAX_ADDRESS_LINE_LENGTH = this.MAX_ADDRESS_LINE_LENGTH - 3
    if(this.mainAddressLine.length > this.MAX_ADDRESS_LINE_LENGTH){
      this.addressLineOne = this.mainAddressLine.slice(0,this.MAX_ADDRESS_LINE_LENGTH);
      this.addressLineTwo = this.mainAddressLine.slice(this.MAX_ADDRESS_LINE_LENGTH,this.mainAddressLine.length);
      this.insertAddressAccordionButton = true;
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
        console.log(address_);
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
      this.addressService.clearCart(userId).then(() => {});
      loader.dismiss();
    }else{
      loader.dismiss();
    }
    this.addressLineTwoVisible = false;
    this.showmodal = false;
    this.MAX_ADDRESS_LINE_LENGTH = 30;
  }
  setopen(){
    this.addressLineTwoVisible = true;
    this.showmodal = true;
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
