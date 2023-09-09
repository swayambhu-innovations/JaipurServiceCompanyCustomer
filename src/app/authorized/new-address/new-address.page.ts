import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AddressService } from '../select-address/address.service';
import { DataProviderService } from 'src/app/core/data-provider.service';
import { Router, RouterLink } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-new-address',
  templateUrl: './new-address.page.html',
  styleUrls: ['./new-address.page.scss'],
})
export class NewAddressPage implements OnInit {

  constructor(private addressService:AddressService,private dataProvider:DataProviderService, private loadingController: LoadingController, private router:Router) { }
  addressForm:FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    addressLine1: new FormControl('', Validators.required),
    addressLine2: new FormControl('', Validators.required),
    pinCode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{6}$')]),
  })
  ngOnInit() {
  }
  async submit(){
    let loader = await this.loadingController.create({message:'Adding address...'})
    loader.present()
    this.addressService.addAddress(this.dataProvider.currentUser!.user!.uid, this.addressForm.value).then(()=>{
      this.addressForm.reset()
      this.router.navigate(['/authorized/select-address'])
    }).catch(err=>{
    }).finally(()=>loader.dismiss())
  }
}
