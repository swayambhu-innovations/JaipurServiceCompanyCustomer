import { Component, OnInit } from '@angular/core';
import { error } from 'console';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

// import {Share} from '@capacitor/share';

@Component({
  selector: 'app-refer-afriend',
  templateUrl: './refer-afriend.page.html',
  styleUrls: ['./refer-afriend.page.scss'],
})
export class ReferAfriendPage implements OnInit {

  constructor(
    private socialSharing: SocialSharing
  ) { }

  ngOnInit() {
  }
  // https://www.linkedin.com/feed/

   shareLink(){
    navigator.share({
      title: 'JSC app Download Link',
      url: 'https://play.google.com/store/apps/details?id=com.shreeva.jaipurservicecompanycustomer'
    }).then(()=>{
    })
    .catch(console.error);

    // await Share.share({
    //   url: 'https://play.google.com/store/apps/details?id=com.shreeva.jaipurservicecompanycustomer',
    // });
  }

  shareLink2(){
    alert(1);
    this.socialSharing.share('Check out this link', 'Subject', undefined, 'https://play.google.com/store/apps/details?id=com.shreeva.jaipurservicecompanycustomer')
    .then(() => {
      alert(2);
      console.log('Shared successfully');
    })
    .catch((error) => {
      alert("3 - "+error);
      console.error('Error sharing:', error);
    });
  }

  

}
