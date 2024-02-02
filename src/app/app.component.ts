import { Component, OnInit } from '@angular/core';
import { register } from 'swiper/element/bundle';
register();
import { Filesystem, Directory, Encoding, FilesystemPlugin } from '@capacitor/filesystem';
import { Platform } from '@ionic/angular';
import { NavigationBackService } from './navigation-back.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { App } from '@capacitor/app';
import { Network } from '@capacitor/network';
import { LocationService } from './authorized/new-address/services/location.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  currentUrl: string;
  constructor(
    private platform: Platform,
    public _navigationBack : NavigationBackService,
    private locationService:LocationService,
    private router: Router) {
      
    this.locationService.initLocation();
    this.createCasheFolder();
    this.platform.backButton.subscribeWithPriority(10, () => {
      const previousUrlArray = this._navigationBack.getPreviourUrl();
      if(this.currentUrl == '/authorized/home' || this.currentUrl == '/no-internet'){
        if(this.platform.is('cordova') || this.platform.is('mobile')){
          App.exitApp();
        }
      }
      else{
        const previousUrl = previousUrlArray[previousUrlArray.length - 2];
        this._navigationBack.setDataAfterNavigation();
        this.router.navigate([previousUrl]);
      }
      
      
    });
    Network.addListener('networkStatusChange', status => {
      if(!status.connected){
        this._navigationBack.isAddressSubscription$ = false;
        setTimeout(() => {
          this.router.navigate(['/no-internet']);
        }, 100);
      }
    });

    this.platform.ready().then(() => {
      this.registerIonicLifecycleEvents();
    });
  }

  private registerIonicLifecycleEvents() {
    this.platform.pause.subscribe(() => {
      //App.exitApp();
    });
  }

  ngOnInit(): void {
    this.router.events.pipe(
        filter((event) => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentUrl = event.url;
      const lastUrlArray = this._navigationBack.getPreviourUrl();
      if(lastUrlArray[lastUrlArray.length -1 ] != event.url){
        this._navigationBack.addPreviousUrl(event.url);
      }
    });
  }

 async createCasheFolder(){
  Filesystem.readdir({
    directory:Directory.Cache,
    path:"CASHED_IMG"
  }).then(list=>{
  }).catch(async e =>{
    await  Filesystem.mkdir({
      directory:Directory.Cache,
      path:`CASHED_IMG`
    });
  })
 
  }
}
