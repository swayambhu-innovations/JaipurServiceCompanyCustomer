import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, Platform } from '@ionic/angular';
import { firstValueFrom, map, Observable, Subject } from 'rxjs';
import { AlertsAndNotificationsService } from 'src/app/alerts-and-notifications.service';
import { AddressService } from 'src/app/authorized/db_services/address.service';
import { DataProviderService } from 'src/app/core/data-provider.service';

@Component({
  selector: 'app-gps-map',
  templateUrl: './gps-map.page.html',
  styleUrls: ['./gps-map.page.scss'],
})
export class GpsMapPage implements OnInit {
  @ViewChild('content', { static: true }) content: any;
  areaOptions: any;
  loading: boolean = false;
  isValidMarker: boolean = false;
  selectedAddress: google.maps.GeocoderResult;
  formattedAdd: string = '';
  mobileView: boolean = false;
  areaName: string = '';
  showHeader: boolean = true;
  private areaSearchText$ = new Subject<string>();
  markerSet: boolean = false;

  currentPosition: google.maps.LatLngLiteral | undefined;
  display: any;
  center: google.maps.LatLngLiteral = {
    lat: 24,
    lng: 12,
  };
  markerOptions: google.maps.MarkerOptions = { draggable: true };
  zoom = 15;
  areaDetails: any;
  editData: any;
  isEdit: boolean = false;
  mapOptionsCircle: any = null;
  circleRadius: number = 6;
  isGoogleMapReady: boolean = false;
  isCatalogue: boolean = true;
  state$: Observable<object>;
  constructor(
    private router: Router,
    private addressService: AddressService,
    private alertify: AlertsAndNotificationsService,
    private platform: Platform,
    public dataProvider: DataProviderService,
    private loadingController: LoadingController,
    public activatedRoute: ActivatedRoute
  ) {
    let addressString: string | null;
    dataProvider.currentUser$.subscribe((data) => {
      if (data) {
        addressString = localStorage.getItem('address');
        if (addressString) {
          this.dataProvider.authLessAddress = JSON.parse(addressString);
          this.router.navigate(['/authorized/home']);
        }
      }
    });
  }

  async ionViewDidEnter() {
    this.scrollToTop();
    this.systemInfo();
    this.isValidMarker = false;
    this.activatedRoute.params.subscribe((params) => {
      if (params && params['lat'] && params['lat'] != 0) {
        this.center = {
          lat: parseFloat(params['lat']),
          lng: parseFloat(params['lng']),
        };
        this.currentPosition = {
          lat: parseFloat(params['lat']),
          lng: parseFloat(params['lng']),
        };
        this.findDetails();
        this.setCircleInMap();
      }
    });
  }

  scrollToTop() {
    if (this.content && this.content.scrollToTop) {
      this.content.scrollToTop();
    }
  }

  async changeLoc() {
    this.router.navigate(['/fetch-address/search-loc', this.center]);
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

  systemInfo() {
    if (this.dataProvider.deviceInfo.deviceType === 'desktop') {
      this.mobileView = false;
    } else if (this.dataProvider.deviceInfo.deviceType === 'mobile') {
      this.mobileView = true;
    }
  }

  ngOnInit(): void {}

  findDetails() {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: this.center }).then((res) => {
      this.selectedAddress = res.results[0];
      this.areaName =
        res.results[0].address_components[1].long_name.toString() +
        ', ' +
        res.results[0].address_components[2].long_name.toString();
      this.formattedAdd = res.results[0].formatted_address.toString();
    });
  }

  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) {
      this.currentPosition = event.latLng.toJSON();
      this.center = event.latLng.toJSON();
      this.findDetails();
      this.setCircleInMap();
    }
  }

  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.display = event.latLng.toJSON();
  }

  newPosition(event: any) {
    this.currentPosition = event.latLng.toJSON();
  }

  onAreaChange($event) {
    this.markerSet = false;
    this.center = {
      lat: $event.detail.value.latitude,
      lng: $event.detail.value.longitude,
    };
    this.setCircleInMap();
  }

  async confirmLoc() {
    this.loading = true;
    let state: string = '';
    let postal: string = '';
    let city: string = '';
    let area: string = '';
    let stateId: string = '';
    let cityId: string = '';
    let newAddress: any = { ...this.selectedAddress };
    newAddress.geometry.location =
      this.selectedAddress.geometry.location.toJSON();
    newAddress.geometry.viewport = '';
    this.selectedAddress.address_components.map((component) => {
      component.types.map((type) => {
        if (type == 'sublocality') area = component.long_name;
        if (type == 'administrative_area_level_1') state = component.long_name;
        if (type == 'administrative_area_level_3') city = component.long_name;
        if (type == 'postal_code') postal = component.long_name;
      });
    });
    await this.addressService.getState().then(async (docs) => {
      docs.docs.map((stat) => {
        if (
          state
            .toLowerCase()
            .includes(stat.data()['state'].toString().toLowerCase())
        )
          stateId = stat.id;
      });

      if (stateId !== '') {
        await this.addressService.getCity(stateId).then((docs) => {
          docs.docs.map((cities) => {
            if (
              city
                .toLowerCase()
                .includes(cities.data()['name'].toString().toLowerCase())
            )
              cityId = cities.id;
          });
          if (cityId !== '') {
            const addressObject = {
              ...newAddress,
              name: area,
              cityId: cityId,
              state: state,
              city: city,
              pincode: postal,
              stateId: stateId,
              selectedArea: newAddress,
              isDefault: true,
            };
            this.dataProvider.authLessAddress = addressObject;
            console.log(this.dataProvider.authLessAddress);
            localStorage.removeItem('address');
            localStorage.setItem('address', JSON.stringify(addressObject));
            this.router.navigate(['/authorized/home']);
          } else this.isCatalogue = false;
        });
      } else this.isCatalogue = false;
    });
    this.loading = false;
  }
}
