import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { FormControl } from '@angular/forms';
import { RecaptchaVerifier } from '@angular/fire/auth';
import { DataProviderService } from '../../core/data-provider.service';
import { AlertsAndNotificationsService } from '../../alerts-and-notifications.service';
import { LoadingController } from '@ionic/angular';
import firebase from 'firebase/compat/app';
import { getApp } from 'firebase/app';
import { ReCaptchaV3Provider, initializeAppCheck } from 'firebase/app-check';
import { error } from 'console';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  phoneNumber: string = '';
  terms: boolean = false;
  recaptchaVerifier: firebase.auth.RecaptchaVerifier | undefined;
  verifier: RecaptchaVerifier | undefined;
  private recaptchaScriptLoaded = false;
  constructor(
    private router: Router,
    private authService: AuthService,
    public dataProvider: DataProviderService,
    private alertify: AlertsAndNotificationsService,
    private loaderService: LoadingController
  ) {
    // this.initializeAppCheck();
    // this.loadRecaptchaScript();
  }

  ngOnInit() {}

  private initializeAppCheck() {
    const app = getApp();
    return initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(
        '6LfX6R0qAAAAAIcWWO84K20lue3arAI5wkWTBNf5'
      ),
      isTokenAutoRefreshEnabled: true,
    });
  }

  private loadRecaptchaScript(): void {
    if (this.recaptchaScriptLoaded) return;

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=6LfX6R0qAAAAAIcWWO84K20lue3arAI5wkWTBNf5`;
    script.onload = () => (this.recaptchaScriptLoaded = true);
    script.onerror = () => console.error('Failed to load reCAPTCHA script');
    document.head.appendChild(script);
  }

  isRecaptchaScriptLoaded(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.recaptchaScriptLoaded) {
        resolve(true);
      } else {
        const interval = setInterval(() => {
          if (this.recaptchaScriptLoaded) {
            clearInterval(interval);
            resolve(true);
          }
        }, 100);
      }
    });
  }

  async setupRecaptcha(): Promise<RecaptchaVerifier> {
    // await this.isRecaptchaScriptLoaded();
    return new RecaptchaVerifier(
      'recaptcha-container',
      {
        size: 'invisible',
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber
        },
      },
      this.authService.auth
    );
  }

  // async login() {
  //   let loader = await this.loaderService.create({
  //     message: 'Logging in...',
  //   });
  //   loader.present();

  //   try {
  //     await this.setupRecaptcha().then(async (recaptchaVerifier) => {
  //       console.log(recaptchaVerifier);
  //       await this.authService
  //         .loginWithPhoneNumber(this.phoneNumber, recaptchaVerifier)
  //         .then((login) => {
  //           this.dataProvider.loginConfirmationResult = login;
  //           this.dataProvider.userMobile = this.phoneNumber;
  //           this.router.navigate(['unauthorized/otp']);
  //         })
  //         .catch((error) => {
  //           console.log(error);
  //           this.alertify.presentToast(error.message);
  //         })
  //         .finally(() => {
  //           loader.dismiss();
  //         });
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

   async login() {
    let loader = await this.loaderService.create({
      message: 'Logging in...',
    });
    loader.present();
    if (!this.verifier)
      this.verifier = new RecaptchaVerifier(
        'recaptcha-container',
        { size: 'invisible' },
        this.authService.auth
      );
    this.authService
      .loginWithPhoneNumber(this.phoneNumber, this.verifier)
      .then((login) => {
        this.dataProvider.loginConfirmationResult = login;
        this.dataProvider.userMobile = this.phoneNumber;
        this.phoneNumber = '';
        this.terms = false;
        this.router.navigate(['unauthorized/otp']);
      })
      .catch((error) => {
        console.log(error);
        this.alertify.presentToast(error.message);
      })
      .finally(() => {
        loader.dismiss();
      });
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
