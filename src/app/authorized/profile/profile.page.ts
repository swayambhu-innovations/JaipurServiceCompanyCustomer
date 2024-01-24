import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { DataProviderService } from 'src/app/core/data-provider.service';

import { getAuth, deleteUser, Auth, signOut } from '@angular/fire/auth';
import { error } from 'console';
import { NavigationBackService } from 'src/app/navigation-back.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  [x: string]: any;
  constructor(
    public router: Router,
    private modalCtrl: ModalController,
    public navCtrl: NavController,
    public dataProvider:DataProviderService,
    public _navigationService : NavigationBackService
    
  ) {
   // this.router.navigate(['authorized/profile/profile-info']);
  }

  ngOnInit() {
  }
  
  close(url:any) {
    this.router.navigate([url]);
  }

  job() {
    this.router.navigate(['job-history']);
  }
  financial() {
    this.router.navigate(['/financial-details']);
  }
  editProfile() {
    this.router.navigate(['/edit-profile']);
  }

  signout() {
    this.router.navigate(['/signout']);
  }
  logout() {
    this._navigationService.isAddressSubscription$ = false;
    signOut(getAuth())
    .then(() => this.closeModal())
    .catch((error: any) => console.log(error))
    
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
