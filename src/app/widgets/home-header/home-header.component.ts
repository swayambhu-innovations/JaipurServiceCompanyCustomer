import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AddressService } from 'src/app/authorized/select-address/address.service';
import { Address } from 'src/app/authorized/select-address/address.structure';

@Component({
  selector: 'app-home-header',
  templateUrl: './home-header.component.html',
  styleUrls: ['./home-header.component.scss'],
})
export class HomeHeaderComponent  implements OnInit {
  @Input() MAX_ADDRESS_LINE_LENGTH!:number;
  // addressLine:string = "Nehru Rd, Vile Parle East, Mumbai"
  mainAddressLine:string = '';
  // main address line one is the input address line provided by the database where as the address line 1 and 2 are calculated by the client side depending upn the address character length
  addressLineOne:string = ''
  addressLineTwo:string = ''
  // this toggle is used to show the address line 2
  addressLineTwoVisible:boolean = false;
  insertAddressAccordionButton:boolean = false;
  constructor( private router:Router, public addressService:AddressService) {
  }
   notification(){
    this.router.navigate(['authorized/notification']);
   }

  ngOnInit() {
    this.addressService.fetchedAddresses.subscribe((address:Address[])=>{
      if(address.length > 0){
        this.mainAddressLine = address[0].addressLine1 + ', ' + address[0].addressLine2 + ', ' + address[0].pinCode;
        this.MAX_ADDRESS_LINE_LENGTH = this.MAX_ADDRESS_LINE_LENGTH - 3
        if(this.mainAddressLine.length > this.MAX_ADDRESS_LINE_LENGTH){
          this.addressLineOne = this.mainAddressLine.slice(0,this.MAX_ADDRESS_LINE_LENGTH);
          this.addressLineTwo = this.mainAddressLine.slice(this.MAX_ADDRESS_LINE_LENGTH,this.mainAddressLine.length);
          this.insertAddressAccordionButton = true;
        }
      }
    })
    this.MAX_ADDRESS_LINE_LENGTH = this.MAX_ADDRESS_LINE_LENGTH - 3
    if(this.mainAddressLine.length > this.MAX_ADDRESS_LINE_LENGTH){
      this.addressLineOne = this.mainAddressLine.slice(0,this.MAX_ADDRESS_LINE_LENGTH);
      this.addressLineTwo = this.mainAddressLine.slice(this.MAX_ADDRESS_LINE_LENGTH,this.mainAddressLine.length);
      this.insertAddressAccordionButton = true;
    }
  }

}
