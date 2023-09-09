import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertsAndNotificationsService } from '../../alerts-and-notifications.service';
import { DataProviderService } from '../../core/data-provider.service';
import { AuthService } from '../../core/auth.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.page.html',
  styleUrls: ['./otp.page.scss'],
})
export class OtpPage implements OnInit {
  otp: any; 
  showOtpComponent = true;
  @ViewChild('ngOtpInput', { static: false}) ngOtpInput: any;

  constructor(private router: Router,private dataProvider:DataProviderService,private alertify:AlertsAndNotificationsService,private authService:AuthService, private loadingController: LoadingController) { }

  ngOnInit() {
    if(!this.dataProvider.loginConfirmationResult){
      this.alertify.presentToast("Some Error occurred. Please enter phone again.")
      this.router.navigate(['/login']);
    }
  }

  async login(){
    if(this.dataProvider.loginConfirmationResult){
      let loader = await this.loadingController.create({message:'Logging in...'});
      loader.present();
      this.dataProvider.loginConfirmationResult.confirm(this.otp).then((result)=>{
        console.log(result);
        this.authService.setUserData(result.user);
        this.router.navigate(['/home']);
      }).catch((error)=>{
        console.log(error);
        this.alertify.presentToast(error.message);
      }).finally(()=>{
        loader.dismiss();
      })
    }
  }

  config = {
    allowNumbersOnly: false,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '50px',
      'height': '50px'
    }
  };
  onOtpChange(otp:any) {
    this.otp = otp;
  }
  setVal(val:number) {
    this.ngOtpInput.setValue(val);
  }
  toggleDisable(){
    if(this.ngOtpInput.otpForm){
      if(this.ngOtpInput.otpForm.disabled){
        this.ngOtpInput.otpForm.enable();
      }else{
        this.ngOtpInput.otpForm.disable();
      }
    }
  }

  onConfigChange() {
    this.showOtpComponent = false;
    this.otp = null;
    setTimeout(() => {
      this.showOtpComponent = true;
    }, 0);
  }

}