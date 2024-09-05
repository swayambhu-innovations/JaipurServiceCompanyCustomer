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
import { App } from '@capacitor/app';
import { AuthService } from 'src/app/core/auth.service';

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
  setVersion: any;
  public isFaq: boolean = false;
  constructor(
    public router: Router,
    private modalCtrl: ModalController,
    public navCtrl: NavController,
    public dataProvider: DataProviderService,
    private appVersion: AppVersion,
    private platform: Platform,
    private authService: AuthService,
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
      await App.getInfo().then((info) => {
        this.setVersion = info.version;
      });
    } else {
      await this.authService.checkVersion().then((res) => {
        this.setVersion = String(res.data()!['versionCode']);
      });
    }
  }

  close(url: any) {
    this.router.navigate([url]);
  }

  async setopen() {
    if (this.dataProvider.currentUser) {
      let currentPosition = this.dataProvider.authLessAddress.geometry.location;
      this.router.navigate(['/fetch-address/gps-map', currentPosition]);
    }
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
