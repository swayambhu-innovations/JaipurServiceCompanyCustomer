import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertsAndNotificationsService } from '../../alerts-and-notifications.service';
import { DataProviderService } from '../../core/data-provider.service';
import { AuthService } from '../../core/auth.service';
import { LoadingController } from '@ionic/angular';
import { RecaptchaVerifier } from 'firebase/auth';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.page.html',
  styleUrls: ['./otp.page.scss'],
})
export class OtpPage implements OnInit {
  otp: any;
  showOtpComponent = true;
  verifier: RecaptchaVerifier | undefined;
  resendOtpTime: number = 60;
  @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;
  constructor(
    private router: Router,
    public dataProvider: DataProviderService,
    private alertify: AlertsAndNotificationsService,
    private authService: AuthService,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    if (!this.dataProvider.loginConfirmationResult) {
      this.alertify.presentToast(
        'Some Error occurred. Please enter phone again.'
      );
      this.router.navigate(['unauthorized/login']);
    } else {
      this.startResendTimer();
    }
  }
  async sendOTP() {
    
    if (this.dataProvider.loginConfirmationResult) {
      let loader = await this.loadingController.create({
        message: 'OTP Sending...',
      });
      loader.present();
      if (!this.verifier)
        this.verifier = new RecaptchaVerifier(
          'recaptcha-container2',
          { size: 'invisible' },
          this.authService.auth
        );
      this.authService
        .loginWithPhoneNumber(this.dataProvider.userMobile, this.verifier)
        .then((login) => {
          this.alertify.presentToast('OTP send on Successfully. Please Check!');
          this.resendOtpTime = 60;
          this.startResendTimer();
        })
        .catch((error) => {
          this.alertify.presentToast(error.message);
        })
        .finally(() => {
          loader.dismiss();
        });
    }  
  }
  async login() {
    
    if (this.dataProvider.loginConfirmationResult) {
      let loader = await this.loadingController.create({
        message: 'Logging in...',
      });
      loader.present();
      this.dataProvider.loginConfirmationResult
        .confirm(this.otp)
        .then((result) => {
          this.authService.setUserData(result.user);
          this.router.navigate(['authorized/profile/profile-info']);
        })
        .catch((error) => {
          console.log(error);
          this.alertify.presentToast(error.message);
        })
        .finally(() => {
          loader.dismiss();
        });
    }
  }

  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputmode: "tel",
    inputStyles: {
      width: '38px',
      height: '38px',
    },
  };
  onOtpChange(otp: any) {
    this.otp = otp;
  }
  setVal(val: number) {
    this.ngOtpInput.setValue(val);
  }
  toggleDisable() {
    if (this.ngOtpInput.otpForm) {
      if (this.ngOtpInput.otpForm.disabled) {
        this.ngOtpInput.otpForm.enable();
      } else {
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

  startResendTimer() {
    setTimeout(() => {
      if (this.resendOtpTime > 0) {
        this.resendOtpTime--;
        this.startResendTimer();
      }
    }, 1000);
  }
}
