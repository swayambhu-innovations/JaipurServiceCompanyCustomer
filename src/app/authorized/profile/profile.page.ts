import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { DataProviderService } from 'src/app/core/data-provider.service';

import { getAuth, deleteUser, Auth, signOut } from '@angular/fire/auth';
import { error } from 'console';
import { NavigationBackService } from 'src/app/navigation-back.service';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { UpcomingHistoryPage } from '../booking/upcoming-history/upcoming-history.page';

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
  public isFaq: boolean = false;
  constructor(
    public router: Router,
    private modalCtrl: ModalController,
    public navCtrl: NavController,
    public dataProvider: DataProviderService,
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

  openNotification(){
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
  openAddress(){
    if (this.dataProvider.currentUser)
      this.router.navigate(['/authorized/select-address']);
  }

  signout() {
    this.router.navigate(['/signout']);
  }
  logout() {
    this._navigationService.isAddressSubscription$ = false;
    signOut(getAuth())
      .then(() => {
        this.closeModal();
        window.location.reload();
      })
      .catch((error: any) => console.log(error));
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
