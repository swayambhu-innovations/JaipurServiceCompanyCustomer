import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { LocationService } from '../authorized/new-address/services/location.service';
import { DataProviderService } from '../core/data-provider.service';

@Component({
  selector: 'app-fetch-address',
  templateUrl: './fetch-address.page.html',
  styleUrls: ['./fetch-address.page.scss'],
})
export class FetchAddressPage implements OnInit {
  constructor(
    private router: Router,
    private locationService: LocationService,
    private platform: Platform,
    public dataProvider: DataProviderService,
    public activatedRoute: ActivatedRoute
  ) {}

  currentPosition: google.maps.LatLngLiteral = {
    lat: 0,
    lng: 0,
  };

  ngOnInit() {}

  async ionViewDidEnter() {
    this.getLocation();
  }

  async getLocation() {
    if (this.platform.is('capacitor')) {
      firstValueFrom(this.locationService.currentLocation).then((position) => {
        this.currentPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        this.router.navigate(['/fetch-address/gps-map', this.currentPosition]);
      });
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.router.navigate([
            '/fetch-address/gps-map',
            this.currentPosition,
          ]);
        },
        (error) => {
          setTimeout(() => this.getLocation(), 500);
          this.router.navigate(['/fetch-address/location-disabled']);
        }
      );
    }
  }
}
