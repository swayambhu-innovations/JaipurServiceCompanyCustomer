import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-confirm-booking',
  templateUrl: './confirm-booking.page.html',
  styleUrls: ['./confirm-booking.page.scss'],
})
export class ConfirmBookingPage implements OnInit {
  name='Confirm Booking';
  constructor(
    private router:Router,
    private alertController:AlertController
  ) { }


  ngOnInit() {
  }

  async alertRequired(){
    const alert = await this.alertController.create({
      header:'Alert',
      // subHeader: 'Important message',
      message: 'Field required',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async alertMissMatched(){
    const alert = await this.alertController.create({
      header:'Alert',
      // subHeader: 'Important message',
      message: 'Captcha miss matched',
      buttons: ['OK'],
    });

    await alert.present();
  }

  checking(captcha:any){
    if(captcha.invalid){
      this.alertRequired();
    }
    else if(captcha.value === 1820){
      this.router.navigate(['/order-placed']);
    }else{
      this.alertMissMatched();
    }
  }

}
