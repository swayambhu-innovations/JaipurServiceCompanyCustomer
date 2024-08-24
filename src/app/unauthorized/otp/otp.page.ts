import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertsAndNotificationsService } from '../../alerts-and-notifications.service';
import { DataProviderService } from '../../core/data-provider.service';
import { AuthService } from '../../core/auth.service';
import { LoadingController } from '@ionic/angular';
import { RecaptchaVerifier } from 'firebase/auth';
import { confirmSignUp, autoSignIn, signOut, signIn } from 'aws-amplify/auth';
import { SmsRetriever } from '@ionic-native/sms-retriever/ngx';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.page.html',
  styleUrls: ['./otp.page.scss'],
})
export class OtpPage implements OnInit {
  testOtp = '12345';
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
    private loadingController: LoadingController,
    private smsRetriever: SmsRetriever
  ) {}

  ngOnInit() {
    // if (!this.dataProvider.loginConfirmationResult) {
    //   this.alertify.presentToast(
    //     'Some Error occurred. Please enter phone again.'
    //   );
    //   this.router.navigate(['unauthorized/login']);
    // } else {
    //   this.startResendTimer();
    // }
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

  start() {
    this.smsRetriever.startWatching()
      .then((res: any) => {
        console.log(res);
        this.login(res);
      })
      .catch((error: any) => console.error(error));
  }

  async login(data:any) {
    if (this.dataProvider.isSignUpUserID) {
      let loader = await this.loadingController.create({
        message: 'Logging in...',
      });
      loader.present();

      if (
        this.otp === this.testOtp &&
        this.dataProvider.userMobile == '1234567890'
      ) {
        // Simulate successful login for test OTP
        this.authService
          .setUserData(`+91${this.dataProvider.userMobile}`)
          .then(() => {
            this.dataProvider.checkingAuth = true;
            this.dataProvider.loggedIn = true;
            this.dataProvider.firstTimeLogin = true;
            localStorage.setItem(
              'firstTimeLogin',
              JSON.stringify({ firstTimeLogin: true })
            );
            this.router.navigate(['authorized/profile/profile-info']);
          });
        loader.dismiss();
        return;
      }
      // this.dataProvider.loginConfirmationResult
      //   .confirm(this.otp)
      //   .then((result) => {
      //     this.authService.setUserData(result.user).then(()=>{
      //       this.router.navigate(['authorized/profile/profile-info']);
      //     });
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //     this.alertify.presentToast(error.message);
      //   })
      //   .finally(() => {
      //     loader.dismiss();
      //   });

      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username: `+91${this.dataProvider.userMobile}`,
        confirmationCode: this.otp,
      });
      if (isSignUpComplete) {
        await signIn({
          username: `+91${this.dataProvider.userMobile}`,
          password: 'Shreeva@2022',
        })
          .then((res) => {
            const { isSignedIn, nextStep } = res;
            if (isSignedIn)
              this.authService
                .setUserData(`+91${this.dataProvider.userMobile}`)
                .then(() => {
                  this.dataProvider.checkingAuth = true;
                  this.dataProvider.loggedIn = true;
                  this.dataProvider.firstTimeLogin = true;
                  localStorage.setItem(
                    'firstTimeLogin',
                    JSON.stringify({ firstTimeLogin: true })
                  );
                  this.router.navigate(['authorized/profile/profile-info']);
                });
          })
          .catch((err) => {
            console.log(err);
          });
        loader.dismiss();
      }
    }
  }

  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputmode: 'tel',
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

// import { Component, OnInit, ViewChild } from '@angular/core';
// import { Router } from '@angular/router';
// import { AlertsAndNotificationsService } from '../../alerts-and-notifications.service';
// import { DataProviderService } from '../../core/data-provider.service';
// import { AuthService } from '../../core/auth.service';
// import { LoadingController } from '@ionic/angular';
// import { RecaptchaVerifier } from 'firebase/auth';
// import { confirmSignUp, autoSignIn, signOut, signIn } from 'aws-amplify/auth';

// @Component({
//   selector: 'app-otp',
//   templateUrl: './otp.page.html',
//   styleUrls: ['./otp.page.scss'],
// })
// export class OtpPage implements OnInit {
//   otp: any;
//   showOtpComponent = true;
//   verifier: RecaptchaVerifier | undefined;
//   resendOtpTime: number = 60;
//   @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;

//   constructor(
//     private router: Router,
//     public dataProvider: DataProviderService,
//     private alertify: AlertsAndNotificationsService,
//     private authService: AuthService,
//     private loadingController: LoadingController
//   ) {}

//   ngOnInit() {}

//   async sendOTP() {
//     if (this.dataProvider.loginConfirmationResult) {
//       let loader = await this.loadingController.create({
//         message: 'OTP Sending...',
//       });
//       loader.present();
//       if (!this.verifier)
//         this.verifier = new RecaptchaVerifier(
//           'recaptcha-container2',
//           { size: 'invisible' },
//           this.authService.auth
//         );
//       this.authService
//         .loginWithPhoneNumber(this.dataProvider.userMobile, this.verifier)
//         .then((login) => {
//           this.alertify.presentToast('OTP send on Successfully. Please Check!');
//           this.resendOtpTime = 60;
//           this.startResendTimer();
//         })
//         .catch((error) => {
//           this.alertify.presentToast(error.message);
//         })
//         .finally(() => {
//           loader.dismiss();
//         });
//     }
//   }

//   async login() {
//     if (this.dataProvider.isSignUpUserID) {
//       let loader = await this.loadingController.create({
//         message: 'Logging in...',
//       });
//       loader.present();

//       // Check if it's a test phone number and test OTP
//       const isTestUser = this.dataProvider.userMobile === '9876543210';
//       const isTestOtp = this.otp === '654321';

//       console.log('User Mobile:', this.dataProvider.userMobile);
// console.log('Entered OTP:', this.otp);
// console.log('Is Test User:', isTestUser);
// console.log('Is Test OTP:', isTestOtp);

//       if (isTestUser && isTestOtp) {
//         console.log('Test user and OTP detected, bypassing real OTP verification...');
//         await this.authService.setUserData(`+91${this.dataProvider.userMobile}`);
//         this.dataProvider.checkingAuth = true;
//         this.dataProvider.loggedIn = true;
//         this.router.navigate(['authorized/profile/profile-info']);
//         loader.dismiss();
//         return;
//       }

//       try {
//         // Handle real OTP confirmation for regular users
//         const { isSignUpComplete, nextStep } = await confirmSignUp({
//           username: `+91${this.dataProvider.userMobile}`,
//           confirmationCode: this.otp,
//         });

//         if (isSignUpComplete) {
//           await signIn({
//             username: `+91${this.dataProvider.userMobile}`,
//             password: 'Shreeva@2022',
//           })
//             .then((res) => {
//               const { isSignedIn } = res;
//               if (isSignedIn) {
//                 this.authService
//                   .setUserData(`+91${this.dataProvider.userMobile}`)
//                   .then(() => {
//                     this.dataProvider.checkingAuth = true;
//                     this.dataProvider.loggedIn = true;
//                     this.router.navigate(['authorized/profile/profile-info']);
//                   });
//               }
//             })
//             .catch((err) => {
//               console.log(err);
//               this.alertify.presentToast('Error during sign-in.');
//             });
//         }
//       } catch (error) {
//         console.log(error);
//         this.alertify.presentToast('Invalid OTP.');
//       } finally {
//         loader.dismiss();
//       }
//     }
//   }

//   config = {
//     allowNumbersOnly: true,
//     length: 6,
//     isPasswordInput: false,
//     disableAutoFocus: false,
//     placeholder: '',
//     inputmode: 'tel',
//     inputStyles: {
//       width: '38px',
//       height: '38px',
//     },
//   };

//   onOtpChange(otp: any) {
//     this.otp = otp;
//   }

//   setVal(val: number) {
//     this.ngOtpInput.setValue(val);
//   }

//   toggleDisable() {
//     if (this.ngOtpInput.otpForm) {
//       if (this.ngOtpInput.otpForm.disabled) {
//         this.ngOtpInput.otpForm.enable();
//       } else {
//         this.ngOtpInput.otpForm.disable();
//       }
//     }
//   }

//   onConfigChange() {
//     this.showOtpComponent = false;
//     this.otp = null;
//     setTimeout(() => {
//       this.showOtpComponent = true;
//     }, 0);
//   }

//   startResendTimer() {
//     setTimeout(() => {
//       if (this.resendOtpTime > 0) {
//         this.resendOtpTime--;
//         this.startResendTimer();
//       }
//     }, 1000);
//   }
// }
