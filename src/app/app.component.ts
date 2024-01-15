import { Component, OnInit } from '@angular/core';
import { register } from 'swiper/element/bundle';
register();
import { Filesystem, Directory, Encoding, FilesystemPlugin } from '@capacitor/filesystem';
import { Platform } from '@ionic/angular';
import { NavigationBackService } from './navigation-back.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { App } from '@capacitor/app';

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
    private router: Router) {
    this.createCasheFolder();
    this.platform.backButton.subscribeWithPriority(10, () => {
      const previousUrlArray = this._navigationBack.getPreviourUrl();
      if(this.currentUrl == '/authorized/home'){
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
    console.log("list........:",list)
  }).catch(async e =>{
    await  Filesystem.mkdir({
      directory:Directory.Cache,
      path:`CASHED_IMG`
    });
  })
 
  }
}
