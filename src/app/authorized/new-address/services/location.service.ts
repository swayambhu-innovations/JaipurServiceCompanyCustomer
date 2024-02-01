import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Geolocation, Position } from '@capacitor/geolocation';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LocationService {
  currentLocation:Subject<Position> = new Subject<Position>();
  constructor(private platform:Platform) {
  }

  async initLocation(){
    if (this.platform.is('capacitor')) {
      let permissionRequested = await Geolocation.checkPermissions();
      if(permissionRequested.location !== 'granted'){
        permissionRequested = await Geolocation.requestPermissions({permissions:['coarseLocation','location']});
      }
      if (permissionRequested.location !== 'granted'){
        throw new Error('Permission not granted for location');
      };
      this.watchPosition();
    }
  }

  watchPosition(){
    Geolocation.watchPosition({enableHighAccuracy:true,timeout:10000, maximumAge:5000},(position, err)=>{
      if(err){
        return;
      }
      if(!position){
        return;
      }
      this.currentLocation.next(position);
    })
  }
}
