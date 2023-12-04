import { Component } from '@angular/core';
import { register } from 'swiper/element/bundle';
register();
import { Filesystem, Directory, Encoding, FilesystemPlugin } from '@capacitor/filesystem';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {
    this.createCasheFolder();
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
