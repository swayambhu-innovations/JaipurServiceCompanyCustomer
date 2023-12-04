import { Component } from '@angular/core';
// <<<<<<< HEAD
import { register } from 'swiper/element/bundle';
register();


// =======
import { Filesystem, Directory, Encoding, FilesystemPlugin } from '@capacitor/filesystem';
// >>>>>>> 80877a7fbb7b19efe466efe57c919f3651ba0e75
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
