import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { DataProviderService } from 'src/app/core/data-provider.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  constructor(
    private router: Router,
    private modalCtrl: ModalController,
    public navCtrl: NavController,
    public dataProvider:DataProviderService
  ) {
   // this.router.navigate(['authorized/profile/profile-info']);
  }

  ngOnInit() {}
  
  close() {
    this.router.navigate(['/authorized/home']);
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
    this.router.navigate(['/profile']);
    this.modalCtrl.dismiss();
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
