// import { SmsRetriever } from '@ionic-native/sms-retriever/ngx';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { RecaptchaVerifier } from '@angular/fire/auth';
import { DataProviderService } from '../../core/data-provider.service';
import { AlertsAndNotificationsService } from '../../alerts-and-notifications.service';
import { LoadingController } from '@ionic/angular';
import { signUp } from 'aws-amplify/auth';
import { confirmSignUp, deleteUser, signOut, signIn } from 'aws-amplify/auth';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  phoneNumber: string = '';
  terms: boolean = false;
  // testPhoneNumber = '9876543210';
  // testOtp = '654321';
  constructor(
    private router: Router,
    private authService: AuthService,
    public dataProvider: DataProviderService,
    private alertify: AlertsAndNotificationsService,
    private loaderService: LoadingController,
    // private smsRetriever: SmsRetriever
  ) {
    if (dataProvider.currentUser?.userData == undefined)
      dataProvider.checkingAuth = false;
  }

  ngOnInit() {}

  async logout() {
    await signOut({ global: true }).then((res) => {
      console.log(res);
    });
  }

  async userExist() {
    await this.logout();
    let userExist: boolean = false;
    await signIn({
      username: `+91${this.phoneNumber}`,
      password: 'Shreeva@2022',
    })
      .then(async (res) => {
        userExist = true;
      })
      .catch((error) => {
        const code = error.name;
        console.log(error.name);
        switch (code) {
          case 'UserNotFoundException': {
            userExist = false;
            break;
          }
          case 'NotAuthorizedException': {
            userExist = false;
            break;
          }
          case 'PasswordResetRequiredException': {
            userExist = false;
            break;
          }
          case 'UserAlreadyAuthenticatedException': {
            userExist = false;
            break;
          }
          case 'UserNotConfirmedException': {
            userExist = false;
            break;
          }
          case 'UsernameExistsException': {
            userExist = false;
            break;
          }
        }
      });
    if (userExist)
      try {
        await deleteUser();
        await this.logout();
      } catch (error) {
        console.log(error);
      }
  }

  async login() {
    let loader = await this.loaderService.create({
      message: 'Logging in...',
    });
    loader.present();

    if (this.phoneNumber === this.authService.testPhoneNumber) {
      // Skip actual OTP verification for test phone number
      this.dataProvider.userMobile = this.phoneNumber;
      this.phoneNumber = '';
      this.terms = false;
      this.router.navigate(['unauthorized/otp']);
      loader.dismiss();
      return;
    }
    await this.userExist();

    const { isSignUpComplete, userId, nextStep } = await signUp({
      username: `+91${this.phoneNumber}`,
      password: 'Shreeva@2022',
      options: {
        userAttributes: {
          email: 'hello@mycompany.com',
          phone_number: `+91${this.phoneNumber}`, // E.164 number convention
        },
      },
    });

    console.log(isSignUpComplete, userId, nextStep);

    if (userId) {
      this.dataProvider.isSignUpUserID = userId;
      this.dataProvider.userMobile = this.phoneNumber;
      this.phoneNumber = '';
      this.terms = false;
      this.router.navigate(['unauthorized/otp']);
      loader.dismiss();
    }
    // if (!this.verifier) {
    //   this.verifier = new RecaptchaVerifier(
    //     'recaptcha-container',
    //     {
    //       size: 'invisible',
    //       callback: (response) => {
    //         // reCAPTCHA solved, allow signInWithPhoneNumber.
    //         console.log(response);
    //       },
    //     },
    //     this.authService.auth
    //   );
    //   console.log(this.verifier);
    // }

    // await this.authService
    //   .loginWithPhoneNumber(this.phoneNumber, this.verifier)
    //   .then((login) => {
    //     this.dataProvider.loginConfirmationResult = login;
    //     this.dataProvider.userMobile = this.phoneNumber;
    //     this.phoneNumber = '';
    //     this.terms = false;
    //     this.router.navigate(['unauthorized/otp']);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     this.alertify.presentToast(error.message);
    //   })
    //   .finally(() => {
    //     loader.dismiss();
    //   });
  }

  openPrivacy() {
    this.router.navigate(['/privacy-policy']);
  }

  openTnC() {
    this.router.navigate(['/tnc']);
  }

  openRefund() {
    this.router.navigate(['/refund-policy']);
  }
}
