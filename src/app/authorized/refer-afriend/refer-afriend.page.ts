import { Component, OnInit } from '@angular/core';
import { error } from 'console';

@Component({
  selector: 'app-refer-afriend',
  templateUrl: './refer-afriend.page.html',
  styleUrls: ['./refer-afriend.page.scss'],
})
export class ReferAfriendPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  // https://www.linkedin.com/feed/

  shareLink(){
    if(navigator.share){
      navigator.share({
        title: 'JSC app Download Link',
        url: 'https://play.google.com/store/apps/details?id=com.shreeva.jaipurservicecompanycustomer'
      }).then(()=>{
        console.log("thanks for sharing");
      })
      .catch(console.error);
    }
  }

}
