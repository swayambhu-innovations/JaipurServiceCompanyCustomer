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
  constructor(private router: Router) {
    Network.addListener('networkStatusChange', status => {
      if(status.connected){
        this.isBackOnline = true;
        setTimeout(() => {
          this.router.navigate(['unauthorized/login']);
        },10000);
      }
      else{
        this.isBackOnline = false;
      }
    });
  }

  ngOnInit() {
    
  }
  

}
