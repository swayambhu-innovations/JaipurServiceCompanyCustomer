import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, firstValueFrom } from 'rxjs';
import {
  Area,
  City,
  State,
} from './models/address.structure';
import { SignupState } from './models/signup.structure';
import {
  editAddressActions,
  editAddressAreasActions,
  editAddressCitiesActions,
  editAddressStateActions,
} from './actions';
import { LoadingController, Platform } from '@ionic/angular';
import { LocationService } from './services/location.service';
import { AddressService } from '../db_services/address.service';
import { DataProviderService } from 'src/app/core/data-provider.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-address',
  templateUrl: './new-address.page.html',
  styleUrls: ['./new-address.page.scss'],
})
export class NewAddressPage implements OnInit {

  addressForm: FormGroup = new FormGroup({
    state: new FormControl(),
    city: new FormControl(),
    pincode: new FormControl(),
    area: new FormControl(),
    street: new FormControl(),
  });
  currentPosition: google.maps.LatLngLiteral | undefined;
  display: any;
  center: google.maps.LatLngLiteral = {
    lat: 24,
    lng: 12,
  };
  markerOptions: google.maps.MarkerOptions = { draggable: true };
  zoom = 14;
  locationForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    hours: new FormControl(0, Validators.required),
  });
  states$: Observable<State[]> | undefined;
  cities$: Observable<City[]> | undefined;
  areas$: Observable<Area[]> | undefined;
  constructor(private store: Store<{ editAddress: SignupState }>,private platform:Platform,private locationService:LocationService,
    private addressService: AddressService,public dataProvider:DataProviderService, private loadingController: LoadingController,private router:Router) {}

  ngOnInit(): void {
   this.store.dispatch(editAddressStateActions.LOAD());
    this.states$ = this.store.select('editAddress', 'states');
    this.cities$ = this.store.select('editAddress', 'cities');
    this.areas$ = this.store.select('editAddress', 'areas');
    // get current location
    this.getLocation();
  }
  getLocation() {
    if(this.platform.is('capacitor')){
      firstValueFrom(this.locationService.currentLocation).then((position)=>{
        this.currentPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
      })
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        this.currentPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
      },(error)=>{
        setTimeout(() => this.getLocation(),500)
      });
    }
  }
  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) {
      this.center = event.latLng.toJSON();
      this.currentPosition = event.latLng.toJSON();
    }
  }
  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.display = event.latLng.toJSON();
  }
  newPosition(event: any) {
    console.log(event);
    this.currentPosition = event.latLng.toJSON();
  }

  fetchCities(event: any) {
    console.log(event);
    this.store.dispatch(
      editAddressCitiesActions.LOAD({ stateId: event.detail.value.id }),
    );
  }

  fetchAreas(event: any, stateId: string) {
    console.log(event);
    this.store.dispatch(
      editAddressAreasActions.LOAD({ stateId, cityId: event.detail.value.id }),
    );
  }

  fetchPostalCode(event: any) {
    console.log(event);
    let area = event.detail.value as Area;
    let postalCode = area.address_components.find((component: any) =>
      component.types.includes('postal_code'),
    );
    this.addressForm.patchValue({ pincode: postalCode?.long_name });
  }

  // submit() {
  //   this.store.dispatch(
  //     editAddressActions.saveAddressAction({
  //       area: this.addressForm.value.area,
  //       city: this.addressForm.value.city,
  //       latitude: this.currentPosition?.lat || 0,
  //       longitude: this.currentPosition?.lng || 0,
  //       pincode: this.addressForm.value.pincode,
  //       state: this.addressForm.value.state,
  //       street: this.addressForm.value.street,
  //     }),
  //   );
  // }
  async submit(){
    let loader = await this.loadingController.create({message:'Adding address...'});
    let value = {
            area: this.addressForm.value.area,
            city: this.addressForm.value.city,
            latitude: this.currentPosition?.lat || 0,
            longitude: this.currentPosition?.lng || 0,
            pincode: this.addressForm.value.pincode,
            state: this.addressForm.value.state,
            street: this.addressForm.value.street,
          }
          console.log("value.............: ",value)
    // await loader.present()
    // if(this.addressForm.valid){
    //   this.addressService.addAddress(this.dataProvider.currentUser!.user!.uid, value).then(()=>{
    //     this.addressForm.reset()
    //     this.router.navigate(['/authorized/select-address'])
    //   }).catch(err=>{
    //     console.log(err)
    //   }).finally(()=>loader.dismiss())
    // } else{
    //   await loader.dismiss()
    //   console.log("Dismissed");
      
    // }
  }
}
