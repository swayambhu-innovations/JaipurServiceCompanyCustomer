import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-popup',
  templateUrl: './login-popup.component.html',
  styleUrls: ['./login-popup.component.scss'],
})
export class LoginPopupComponent  implements OnInit {



  @Input() isOpen: boolean;

  constructor(private modalCtrl: ModalController,private router: Router) {}
    // ngOnInit() {}
    ngOnInit() {
      console.log(this.isOpen)
    }

    closeModal() {
      this.modalCtrl.dismiss();
    }
  
    skipLogin() {
      this.modalCtrl.dismiss();
    }
  
    login() {
      this.modalCtrl.dismiss({ loggedIn: true });
    }

}
