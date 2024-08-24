import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { DataProviderService } from 'src/app/core/data-provider.service';

import { getAuth, deleteUser, Auth } from '@angular/fire/auth';
import { error } from 'console';
import { signOut } from 'aws-amplify/auth';
import { NavigationBackService } from 'src/app/navigation-back.service';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { UpcomingHistoryPage } from '../booking/upcoming-history/upcoming-history.page';
import { AppVersion } from '@ionic-native/app-version/ngx';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  [x: string]: any;
  deviceInfo: any;
  isWebModalOpen: boolean = false;
  mobileView: boolean = true;
  signoutUser: boolean = false;
  version: any;
  public isFaq: boolean = false;
  constructor(
    public router: Router,
    private modalCtrl: ModalController,
    public navCtrl: NavController,
    public dataProvider: DataProviderService,
    private appVersion: AppVersion,
    private platform: Platform,
    public _navigationService: NavigationBackService,
    public firestore: Firestore
  ) {
    // this.router.navigate(['authorized/profile/profile-info']);
  }

  async ngOnInit() {
    this.isFaq = (
      await getDoc(doc(this.firestore, 'customer-settings', 'faqs'))
    ).data()?.['show'];
    this.systeminfo();
    if (this.platform.is('capacitor')) {
      this.appVersion.getPackageName().then((res) => {
        console.log(res);
        this.version = res;
      });

      this.appVersion.getAppName().then((res) => {
        console.log(res);
        this.version = res;
      });

      if (this.platform.is('android')) {
        this.appVersion.getVersionNumber().then((res) => {
          console.log(res);
          this.version = res;
        });
      } else if (this.platform.is('ios')) {
        this.appVersion.getVersionNumber().then((res) => {
          console.log(res);
          this.version = res;
        });
      }
    }
  }

  close(url: any) {
    this.router.navigate([url]);
  }

  openProfileInfo() {}

  systeminfo() {
    if (this.dataProvider.deviceInfo.deviceType === 'desktop') {
      this.mobileView = false;
    } else if (this.dataProvider.deviceInfo.deviceType === 'mobile') {
      this.mobileView = true;
    }
  }

  openLogin() {
    this.router.navigate(['unauthorized/login']);
  }

  openNotification() {
    this.router.navigate(['authorized/notification']);
  }

  async openUpcomingBooking() {
    this.router.navigate(['authorized/booking/upcoming-history']);
  }

  job() {
    this.router.navigate(['job-history']);
  }
  financial() {
    this.router.navigate(['/financial-details']);
  }
  openBooking() {
    if (this.dataProvider.currentUser)
      this.router.navigate(['/authorized/booking/upcoming-history']);
  }
  editProfile() {
    if (this.dataProvider.currentUser)
      this.router.navigate(['/authorized/profile/profile-info']);
  }
  openAddress() {
    if (this.dataProvider.currentUser)
      this.router.navigate(['/authorized/select-address']);
  }

  async logout() {
    this._navigationService.isAddressSubscription$ = false;
    await signOut({ global: true })
      .then(() => {
        this.closeModal();
        this.dataProvider.currentUser = undefined;
        this.dataProvider.loggedIn = false;
        this.dataProvider.checkingAuth = true;
        this.dataProvider.authLessAddress = undefined;
        localStorage.removeItem('address');
        localStorage.removeItem('user');
        this.dataProvider.isSignUpUserID = '';
        this.router.navigate(['/fetch-address']);
      })
      .catch((error: any) => console.log(error));
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
