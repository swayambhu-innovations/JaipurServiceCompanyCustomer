import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Network } from '@capacitor/network';
@Component({
  selector: 'app-no-internet',
  templateUrl: './no-internet.component.html',
  styleUrls: ['./no-internet.component.scss'],
})
export class NoInternetComponent  implements OnInit {
  isBackOnline: boolean = false;
  checkStatus:boolean = true;
  constructor(private router: Router) {
  }

  ngOnInit() {
    
  }
  ionViewDidEnter(){
    this.checkStatus = true;
    Network.addListener('networkStatusChange', status => {
      if(status.connected && this.checkStatus){
        this.isBackOnline = true;
        setTimeout(() => {
          this.router.navigate(['unauthorized/login']);
        },500);
      }
      else{
        this.isBackOnline = false;
      }
    });
  }

  ionViewDidLeave(){
    this.checkStatus = false;
  }

}
