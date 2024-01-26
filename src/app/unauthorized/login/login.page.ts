import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { FormControl } from '@angular/forms';
import { RecaptchaVerifier } from '@angular/fire/auth';
import { DataProviderService } from '../../core/data-provider.service';
import { AlertsAndNotificationsService } from '../../alerts-and-notifications.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  phoneNumber:string= '';
  terms:boolean= false;
  verifier:RecaptchaVerifier|undefined;
  constructor(private router: Router,private authService:AuthService,public dataProvider:DataProviderService,private alertify:AlertsAndNotificationsService,private loaderService:LoadingController) { }

  ngOnInit() {
    
  }

  async login(){
    let loader = await this.loaderService.create({
      message:'Logging in...',
    });
    loader.present();
    if (!this.verifier) this.verifier = new RecaptchaVerifier('recaptcha-container',{'size':'invisible'},this.authService.auth);
    this.authService.loginWithPhoneNumber(this.phoneNumber,this.verifier).then((login)=>{
      this.dataProvider.loginConfirmationResult=login;
      this.dataProvider.userMobile = this.phoneNumber;
      this.router.navigate(['unauthorized/otp'])
    }).catch((error)=>{
      console.log(error);
      this.alertify.presentToast(error.message);
    }).finally(()=>{
      loader.dismiss();
    });
  } 
}
