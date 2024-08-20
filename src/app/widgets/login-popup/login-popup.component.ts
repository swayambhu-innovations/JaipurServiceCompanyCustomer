import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-login-popup',
  templateUrl: './login-popup.component.html',
  styleUrls: ['./login-popup.component.scss'],
})
export class LoginPopupComponent  implements OnInit {



  @Input() isOpen: boolean;

  constructor(private modalCtrl: ModalController) {}
    ngOnInit() {}

  closeModal() {
    this.modalCtrl.dismiss();
  }
  skipLogin() {
    this.modalCtrl.dismiss();
  }

  login() {
    // Add logic to navigate to the login page
    this.modalCtrl.dismiss();
  }

}
