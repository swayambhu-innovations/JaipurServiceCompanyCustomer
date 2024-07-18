import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, Platform } from '@ionic/angular';
import { firstValueFrom, Observable, Subject } from 'rxjs';
import { AlertsAndNotificationsService } from 'src/app/alerts-and-notifications.service';
import { LocationService } from 'src/app/authorized/new-address/services/location.service';
import { DataProviderService } from 'src/app/core/data-provider.service';

@Component({
  selector: 'app-gps-map',
  templateUrl: './gps-map.page.html',
  styleUrls: ['./gps-map.page.scss'],
})
export class GpsMapPage implements OnInit {
  @ViewChild('content', { static: true }) content: any;
  areaOptions: any;
  isValidMarker: boolean = false;
  selectedState: any;
  showHeader: boolean = true;
  private areaSearchText$ = new Subject<string>();
  isSubmitForm: boolean = false;
  // addressForm = this.fb.group({
  //   name: ['', Validators.required],
  //   addressLine1: ['', Validators.required],
  //   selectedArea: ['', Validators.required],
  //   city: ['', Validators.required],
  //   state: ['', Validators.required],
  //   pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
  // });
  markerSet: boolean = false;

  currentPosition: google.maps.LatLngLiteral | undefined;
  display: any;
  center: google.maps.LatLngLiteral = {
    lat: 24,
    lng: 12,
  };
  markerOptions: google.maps.MarkerOptions = { draggable: true };
  zoom = 14;
  // locationForm: FormGroup = new FormGroup({
  //   name: new FormControl('', Validators.required),
  //   hours: new FormControl(0, Validators.required),
  // });
  // states$: Observable<State[]> | undefined;
  // cities$: Observable<City[]> | undefined;
  // areas$: Observable<Area[]> | undefined;
  areaDetails: any;
  editData: any;
  isEdit: boolean = false;
  mapOptionsCircle: any = null;
  circleRadius: number = 6;
  isGoogleMapReady: boolean = false;
  isCatalogue: boolean = false;
  constructor(
    private router: Router,
    private locationService: LocationService,
    private alertify: AlertsAndNotificationsService,
    private platform: Platform,
    public dataProvider: DataProviderService,
    private loadingController: LoadingController
  ) {}

  async ionViewDidEnter() {
    this.scrollToTop();
    this.isValidMarker = false;
    // this.addressForm.reset();
    this.isSubmitForm = false;
    const navigation = this.router.getCurrentNavigation();
    let haveOldAddresses = true;

    this.getLocation();
  }

  scrollToTop() {
    if (this.content && this.content.scrollToTop) {
      this.content.scrollToTop();
    }
  }

  async changeLoc() {
    await this.getLocation();
  }

  setCircleInMap() {
    this.isGoogleMapReady = false;
    this.mapOptionsCircle = {
      fillColor: 'rgba(0, 255, 0, 0.5)', // Fill color with alpha (transparency)
      clickable: true,
      strokeColor: 'rgba(0, 255, 0, 0.9)',
    };
    setTimeout(() => {
      this.isGoogleMapReady = true;
    }, 10);
  }

  ngOnInit(): void {
    // this.dataProvider.isPageLoaded$.next('loaded');
    // // get current location
    // this.areas$.subscribe(result=>{
    // });
  }

  compareStateFn(e1: any, e2: any): boolean {
    if (e2.name) {
      return e1 && e2 ? e1.name === e2.name : e1 == e2;
    } else {
      return e1 && e2 ? e1.state === e2.state : e1 == e2;
    }
  }

  compareCityFn(e1: any, e2: any): boolean {
    if (e2.name) {
      return e1 && e2 ? e1.name === e2.name : e1 == e2;
    } else {
      return e1 && e2 ? e1.state === e2.state : e1 == e2;
    }
  }

  compareAreaFn(e1: any, e2: any): boolean {
    if (e2.name) {
      return e1 && e2 ? e1.name === e2.name : e1 == e2;
    } else {
      return e1 && e2 ? e1.state === e2.state : e1 == e2;
    }
  }

  async getLocation(setCenter: boolean = true) {
    if (this.platform.is('capacitor')) {
      let loader = await this.loadingController.create({
        message: 'Getting location...',
      });
      loader.present();
      firstValueFrom(this.locationService.currentLocation).then((position) => {
        this.currentPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        if (setCenter) {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
        } else {
        }
        loader.dismiss();
        this.setPointerOutside();
      });
    } else {
      let loader = await this.loadingController.create({
        message: 'Getting location...',
      });
      loader.present();
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          if (setCenter) {
            this.center = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
          } else {
          }
          loader.dismiss();
          this.setPointerOutside();
        },
        (error) => {
          setTimeout(() => this.getLocation(), 500);
        }
      );
    }
  }
  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) {
      this.currentPosition = event.latLng.toJSON();
      this.setPointerOutside();
    }
  }

  setPointerOutside() {
    const distanceInKm = this.getDistanceInKM(
      this.center.lat,
      this.center.lng,
      this.currentPosition?.lat,
      this.currentPosition?.lng
    );
    if (distanceInKm > this.circleRadius) {
      this.isValidMarker = false;
      this.alertify.presentToast(
        'Selected location point is outside the selected area...'
      );
    } else {
      this.markerSet = true;
      this.isValidMarker = true;
    }
  }

  getDistanceInKM(lat1, lon1, lat2, lon2) {
    if (lat1 === lat2 && lon1 === lon2) return 0;
    const radlat1 = (Math.PI * lat1) / 180,
      radlat2 = (Math.PI * lat2) / 180,
      theta = lon1 - lon2;
    const radtheta = (Math.PI * theta) / 180;
    let dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) dist = 1;
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    dist = dist * 1.609344;
    return dist;
  }

  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.display = event.latLng.toJSON();
  }

  newPosition(event: any) {
    this.currentPosition = event.latLng.toJSON();
  }

  fetchCities(event: any) {
    // this.store.dispatch(
    //   editAddressCitiesActions.LOAD({ stateId: event.detail.value.id }),
    // );
  }

  fetchAreas(event: any, stateId: string) {
    // this.store.dispatch(
    //   editAddressAreasActions.LOAD({ stateId, cityId: event.detail.value.id }),
    // );
  }

  // fetchPostalCode(event: any) {
  //   let area = event.detail.value as Area;
  //   let postalCode = area.address_components.find((component: any) =>
  //     component.types.includes('postal_code'),
  //   );
  //   this.addressForm.patchValue({ pincode: postalCode?.long_name });
  // }

  // async submit(){
  //   this.isSubmitForm = true;
  //   if(!this.addressForm.valid){
  //     this.alertify.presentToast("Please fill all the required fields...");
  //     return;
  //   }
  //   let loader = await this.loadingController.create({message:'Save address...'});
  //   const state = this.addressForm.get("state")?.getRawValue().state;
  //   const stateId = this.addressForm.get("state")?.getRawValue().id;
  //   const city = this.addressForm.get("city")?.getRawValue().name;
  //   const cityId = this.addressForm.get("city")?.getRawValue().id;
  //   const latLong = {
  //     latitude : this.currentPosition?.lat ?? this.center.lat,
  //     longitude : this.currentPosition?.lng ?? this.center.lng
  //   }

  //   let selectedArea:any = this.addressForm.get("selectedArea")?.value;
  //   selectedArea = {...selectedArea, ...latLong};

  //   const addressObject ={
  //     ...selectedArea,
  //     ...this.addressForm.value,
  //     cityId : cityId,
  //     stateId: stateId,
  //     selectedArea : selectedArea,
  //     isDefault : false
  //   }
  //   addressObject.city = city;
  //   addressObject.state = state;
  //   if(this.isEdit){
  //     addressObject.isDefault = this.editData.isDefault;
  //   }
  //   if(this.addressForm.valid){
  //     if(!this.markerSet){
  //       this.alertify.presentToast("Please select a valid marker on the map...");
  //       return;
  //     }
  //     if(!this.isValidMarker){
  //       this.alertify.presentToast("Selected location point is outside the selected area...");
  //       return;
  //     }
  //     if(this.isEdit){
  //     loader.present()
  //      this.addressService.editAddress(this.dataProvider.currentUser!.user!.uid,this.editData.id, addressObject).then(()=>{
  //        this.dataProvider.isFirstTime.next(true);
  //        this.isSubmitForm = false;
  //        this.addressForm.reset();
  //        this.router.navigate(['/authorized/home'])
  //      }).catch(err=>{
  //        console.log(err)
  //      }).finally(()=>loader.dismiss())

  //     }else{
  //       loader.present();
  //       this.addressService.getAddresses(this.dataProvider.currentUser!.user!.uid).then((addresses) => {
  //         let haveOldAddresses = true;
  //         if(addresses.length == 0){
  //           haveOldAddresses = false;
  //           addressObject.isDefault = true;
  //         }
  //         this.alertify.presentToast("Address is added...");
  //         this.addressService.addAddress(this.dataProvider.currentUser!.user!.uid, addressObject).then(()=>{
  //           this.dataProvider.isFirstTime.next(true);
  //           this.addressForm.reset();
  //           if(!haveOldAddresses){
  //             this.router.navigate(['/authorized/home'])
  //           }
  //           else{
  //             this.alertify.presentToast("Address is added...");
  //             const previousUrlArray = this._navigationBack.getPreviourUrl();
  //             const previousUrl = previousUrlArray[previousUrlArray.length - 2];
  //             this._navigationBack.setDataAfterNavigation();
  //             this.router.navigate([previousUrl]);
  //           }
  //         }).catch(err=>{
  //           console.log(err)
  //         }).finally(()=>loader.dismiss())
  //       });

  //       }
  //     }else{
  //       loader.dismiss()
  //     }
  // }

  onAreaChange($event) {
    this.markerSet = false;
    this.center = {
      lat: $event.detail.value.latitude,
      lng: $event.detail.value.longitude,
    };
    this.setCircleInMap();
  }
}
