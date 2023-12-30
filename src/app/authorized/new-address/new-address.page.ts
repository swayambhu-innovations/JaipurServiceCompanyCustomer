import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject, filter, firstValueFrom } from 'rxjs';
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
import { ActivatedRouteSnapshot, CanActivate, NavigationStart, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

@Component({
  selector: 'app-new-address',
  templateUrl: './new-address.page.html',
  styleUrls: ['./new-address.page.scss'],
})
export class NewAddressPage implements OnInit, CanActivate{
  areaOptions: any;
  showHeader:boolean = true;
  private areaSearchText$ = new Subject<string>();
  addressForm = this.fb.group({
    name: ['', Validators.required],
    addressLine1: ['', Validators.required],
    area: [''],
    city: ['', Validators.required],
    state: ['', Validators.required],
    pincode: ['', Validators.required]
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
  searchedAreaDetails: any;
  areaDetails:any;
  constructor(private fb : FormBuilder,private store: Store<{ editAddress: SignupState }>,private platform:Platform,private locationService:LocationService,
    private addressService: AddressService,public dataProvider:DataProviderService, private loadingController: LoadingController
    ,private router:Router) {
     
    }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    throw new Error('Method not implemented.');
  }
  ionViewWillEnter(){
  }
  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    console.log("navigation......:",navigation,navigation?.extras.state?.isfirstTime);
     if(navigation?.extras.state?.isfirstTime){
      this.showHeader =  false
      this.dataProvider.isFirstTime.next(false);
     }else{
      this.showHeader = true;
     }
   this.store.dispatch(editAddressStateActions.LOAD());
    this.states$ = this.store.select('editAddress', 'states');
    this.cities$ = this.store.select('editAddress', 'cities');
    this.areas$ = this.store.select('editAddress', 'areas');
    // get current location
    this.areas$.subscribe(result=>{
    });
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
    this.currentPosition = event.latLng.toJSON();
  }

  fetchCities(event: any) {
    this.store.dispatch(
      editAddressCitiesActions.LOAD({ stateId: event.detail.value.id }),
    );
  }

  fetchAreas(event: any, stateId: string) {
    this.store.dispatch(
      editAddressAreasActions.LOAD({ stateId, cityId: event.detail.value.id }),
    );
  }

  fetchPostalCode(event: any) {
    let area = event.detail.value as Area;
    let postalCode = area.address_components.find((component: any) =>
      component.types.includes('postal_code'),
    );
    this.addressForm.patchValue({ pincode: postalCode?.long_name });
  }

  async submit(){
    let loader = await this.loadingController.create({message:'Adding address...'});
    const state = this.addressForm.get("state")?.getRawValue().state;
    const stateId = this.addressForm.get("state")?.getRawValue().id;
    const city = this.addressForm.get("city")?.getRawValue().name;
    const cityId = this.addressForm.get("city")?.getRawValue().id;
    if(!this.searchedAreaDetails.selectedArea){
      return;
    }
    const addressObject ={
      ...this.searchedAreaDetails,
      ...this.addressForm.value,
      cityId : cityId,
      stateId: stateId
    }
    addressObject.city = city;
    addressObject.state = state;
    addressObject.isDefault = false;
    addressObject.area = addressObject.formatted_address;
    await loader.present()
    if(this.addressForm.valid){
      this.addressService.addAddress(this.dataProvider.currentUser!.user!.uid, addressObject).then(()=>{
        this.dataProvider.isFirstTime.next(true);
        this.addressForm.reset()
        this.router.navigate(['/authorized/select-address'])
      }).catch(err=>{
        console.log(err)
      }).finally(()=>loader.dismiss())
    } else{
      await loader.dismiss()
    }
  }

  createDataForAddAreas(searchedAreaDetails:any){
    searchedAreaDetails.address_components.map((addressComponent:any)=>{
      const geoProofingLocality = addressComponent.types.find((type:any) => type.indexOf("administrative_area_level_3") > -1);
      if(geoProofingLocality){
        searchedAreaDetails['geoProofingLocality'] = addressComponent.long_name;
      }

      searchedAreaDetails['latitude'] = searchedAreaDetails['geometry'].location.lat;
      searchedAreaDetails['longitude'] = searchedAreaDetails['geometry'].location.lng;
      const cityName = addressComponent.types.find((type:any) => type.indexOf("administrative_area_level_2") > -1);
      if(cityName){
        searchedAreaDetails['cityName'] = addressComponent.long_name;
      }

      const cityKey = addressComponent.types.find((type:any) => type.indexOf("administrative_area_level_2") > -1);
      if(cityKey){
        searchedAreaDetails['cityKey'] = addressComponent.short_name;
      }

      const stateName = addressComponent.types.find((type:any) => type.indexOf("administrative_area_level_1") > -1);
      if(stateName){
        searchedAreaDetails['stateName'] = addressComponent.long_name;
      }

      const stateCode = addressComponent.types.find((type:any) => type.indexOf("administrative_area_level_1") > -1);
      if(stateCode){
        searchedAreaDetails['stateCode'] = addressComponent.short_name;
      }

      const countryId = addressComponent.types.find((type:any) => type.indexOf("country") > -1);
      if(countryId){
        searchedAreaDetails['countryId'] = addressComponent.short_name;
      }

      const postalCode = addressComponent.types.find((type:any) => type.indexOf("postal_code") > -1);
      if(postalCode){
        searchedAreaDetails['postalCode'] = addressComponent.long_name;
      }

      const locality = addressComponent.types.find((type:any) => type.indexOf("locality") > -1);
      if(locality){
        searchedAreaDetails['locality'] = addressComponent.long_name;
      }

    });
    this.areas$?.subscribe(areas=>{
      console.log("areas Area.........: ",areas,searchedAreaDetails.geoProofingLocality)
     let selectedArea =  areas.filter(area=> area.geoProofingLocality == searchedAreaDetails.geoProofingLocality);
      if(selectedArea){
        searchedAreaDetails['selectedArea']= selectedArea[0];
      }
    })
    return searchedAreaDetails;
  }

  onAreaDropdownSelect(event:any){
    const placeId = event.place_id;
    this.addressService.getAreaDetailByPlaceId(placeId).subscribe((response:any) => {
      this.areaDetails = response.result;
      console.log("Selected Area.........: ",this.areaDetails)
     
      this.searchedAreaDetails = this.createDataForAddAreas(this.areaDetails);
      if(!this.searchedAreaDetails.selectedArea){
        alert("We do not provide services in this area!")
      }
    });
  }

  getAreaOnSearch(areaSearchInput:any){
    this.addressService.getAreaOnSearch(areaSearchInput.detail.value).subscribe((response:any) => {
      this.areaOptions = response.results;
    });
  }
}
