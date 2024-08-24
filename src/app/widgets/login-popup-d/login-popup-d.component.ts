import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-login-popup-d',
  templateUrl: './login-popup-d.component.html',
  styleUrls: ['./login-popup-d.component.scss'],
})
export class LoginPopupDComponent  implements OnInit {

  constructor(private router: Router,private modalCtrl: ModalController) { }
  isOpen :boolean;

  ngOnInit() {}

  closeModal() {
    this.isOpen=false;
    this.modalCtrl.dismiss();
  }

  skipLogin() {
    this.isOpen=false;
    this.modalCtrl.dismiss();
    // this.router.navigate(['home'])
  }

  login() {
   
    this.router.navigate(['/unauthorized/jsc-logo']);
    this.modalCtrl.dismiss({ loggedIn: true });
    this.isOpen=false;
     
  }

}
