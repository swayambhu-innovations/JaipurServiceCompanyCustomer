import { Injectable } from '@angular/core';
import {
  ApplicationVerifier,
  Auth,
  User,
  UserCredential,
  signInWithPhoneNumber,
} from '@angular/fire/auth';
import { Firestore, docData } from '@angular/fire/firestore';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DataProviderService } from './data-provider.service';
import { AlertsAndNotificationsService } from '../alerts-and-notifications.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ProfileService } from '../authorized/db_services/profile.service';
import { Network } from '@capacitor/network';
import { from, map } from 'rxjs';
import { AddressService } from '../authorized/db_services/address.service';
import { CartService } from '../authorized/cart/cart.service';
import { LoginPopupComponent } from '../widgets/login-popup/login-popup.component';
import { LoginPopupDComponent } from '../widgets/login-popup-d/login-popup-d.component';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  testPhoneNumber = '9876543210';
  testOtp = '654321';
  isProfileUpdated: boolean = false;
  loginCheckTimeout: any;
  isLoginPage = false;
  deviceInfo: any;
  isWebModalOpen: boolean = false;
  mobileView: boolean = true;
  constructor(
    private profileService: ProfileService,
    private router: Router,
    public auth: Auth,
    private firestore: Firestore,
    private dataProvider: DataProviderService,
    private alertify: AlertsAndNotificationsService,
    private loadingController: LoadingController,
    private addressService: AddressService,
    private cartService: CartService,
    private deviceService: DeviceDetectorService,
    private modalController: ModalController
  ) {
    this.onAuth();
  }
  async onAuth() {
    if (
      this.dataProvider.currentUser &&
      (this.dataProvider.currentUser.userData == undefined ||
        this.dataProvider.currentUser.userData == null)
    )
      this.getUserData(
        this.dataProvider.currentUser?.userData['uid']
      ).subscribe(async (userData) => {
        let currUser = { uid: userData?.['uid'] };
        this.dataProvider.currentUser = {
          user: currUser,
          userData: userData,
        };
        const status = await Network.getStatus();
        if (!status.connected) {
          this.router.navigate(['/no-internet']);
        } else if (!userData || !userData.name) {
          this.router.navigate(['/authorized/profile/profile-info']);
        } else {
          if (!this.isProfileUpdated) {
            this.router.navigate(['../../authorized/home']);
          }
        }
      });
    else {
      const status = await Network.getStatus();
      if (!status.connected) {
        this.router.navigate(['/no-internet']);
      } else if (!this.isProfileUpdated) {
        //  await this.scheduleLoginPrompt();
        this.router.navigate(['../../authorized/home']);
      }
      // if (!this.dataProvider.currentUser) {
      else if (!this.isProfileUpdated) {
        this.scheduleLoginPrompt();
      }
      // }
      console.log('step1');
      // this.scheduleLoginPrompt();
    }
  }

  scheduleLoginPrompt() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    if (this.dataProvider.deviceInfo.deviceType === 'desktop') {
      this.isWebModalOpen = true;
      this.mobileView = false;
    } else {
      this.isWebModalOpen = false;
      this.mobileView = true;
    }
    if (this.loginCheckTimeout) {
      clearTimeout(this.loginCheckTimeout);
    }

    console.log('step2', this.dataProvider.currentUser);

    this.loginCheckTimeout = setTimeout(async () => {
      if (!this.dataProvider.currentUser && !this.isLoginPage) {
        await this.openLoginModal();
      }
    }, 600); // 2 minutes
  }

  private async openLoginModal() {
    if (this.mobileView) {
      const modal = await this.modalController.create({
        component: LoginPopupComponent,
        componentProps: { isOpen: true },
        initialBreakpoint: 0,
        breakpoints: [0, 0],
        // backdropDismiss: false,
        backdropDismiss: true,
      });
      await modal.present();

      const { data } = await modal.onWillDismiss();

      if (data && data.loggedIn) {
        this.router.navigate(['../login']);
      }
    }
    // else if (this.isWebModalOpen) {
    //   const modal = await this.modalController.create({
    //     component: LoginPopupDComponent,
    //     componentProps: { isOpen: false },
    //     backdropDismiss: false,
    //     // initialBreakpoint: 0,
    //     // breakpoints: [0, 0],
        
        
    //     // cssClass: 'desktop-login-modal-invisible', 
    //   });
    //   await modal.present();

    //   const { data } = await modal.onWillDismiss();
    //   if (data && data.loggedIn) {
    //     this.router.navigate(['../login']);
    //   }
    // }
  }
  

  cancelLoginPrompt() {
    if (this.loginCheckTimeout) {
      clearTimeout(this.loginCheckTimeout);
      this.loginCheckTimeout = null;
      console.log('Login prompt canceled.');
    }
  }

  updateUserDate(redirect?: boolean) {
    this.dataProvider.checkingAuth = true;
    console.log(this.dataProvider.authLessAddress);
    this.addressService.addAddress(
      this.dataProvider.currentUser!.userData.uid,
      this.dataProvider.authLessAddress
    );
    this.dataProvider.selectedAddress.next(this.dataProvider.authLessAddress);
    let tempBooking,
      cart: any[] = [];
    tempBooking = localStorage.getItem('cart');
    if (tempBooking) cart = [...JSON.parse(tempBooking)];
    if (cart.length > 0) {
      cart.map((item) => {
        item['currentUser'] = {
          name: this.dataProvider.currentUser?.userData['name'],
          phoneNumber: this.dataProvider.currentUser?.userData['phoneNumber'],
          userId: this.dataProvider.currentUser?.userData.uid,
        };
      });
      this.cartService.addLocalHostCart(
        this.dataProvider.currentUser!.userData.uid,
        cart
      );
    }

    this.getAddresses(this.dataProvider.currentUser!.userData.uid).then(
      (result) => {
        const addresses = result.docs.map((address: any) => {
          return { ...address.data(), id: address.id };
        });
        this.dataProvider.firstTimeLogin = false;
        localStorage.setItem(
          'firstTimeLogin',
          JSON.stringify({ firstTimeLogin: false })
        );
        this.router.navigate(['/authorized/home']);
        // if (addresses.length > 0) {
        // } else {
        //   this.router.navigate(['/authorized/new-address']);
        // }
      }
    );
  }

  async getAddresses(userId: string) {
    return await getDocs(
      collection(this.firestore, 'users', userId, 'addresses')
    );
  }

  getUserData(uid: string) {
    const userQuery = query(
      collection(this.firestore, 'users'),
      where('authId', '==', uid)
    );
    const userDocsPromise = getDocs(userQuery);

    return from(userDocsPromise).pipe(
      map((userDocs) => {
        if (userDocs.docs.length > 0) {
          const firstUserDoc = userDocs.docs[0];
          return firstUserDoc.data();
        } else {
          return null;
        }
      })
    );
  }

  async loginWithPhoneNumber(phone: string, appVerifier: ApplicationVerifier) {
    if (phone === this.testPhoneNumber) {
      // login for test phone number
      return Promise.resolve({
        user: { phoneNumber: this.testPhoneNumber } as User,
      });
    }

    if (phone.length != 10) {
      return Promise.reject(new Error('Invalid Phone Number'));
    }
    return signInWithPhoneNumber(this.auth, '+91' + phone, appVerifier);
  }

  async setUserData(phone: string) {
    let loader = await this.loadingController.create({
      message: 'Please wait...',
    });
    loader.present();
    let userDocs = await getDocs(
      query(
        collection(this.firestore, 'users'),
        where('phoneNumber', '==', phone)
      )
    );
    let userDoc = userDocs.docs.map((user) => {
      return { ...user.data(), uid: user.id };
    });

    console.log(userDoc);

    if (userDoc[0]) {
      this.dataProvider.currentUser = {
        user: { uid: userDoc[0]['uid'] },
        userData: userDoc[0],
      };
      this.dataProvider.currentUser$.next(this.dataProvider.currentUser);
      localStorage.setItem(
        'user',
        JSON.stringify(this.dataProvider.currentUser)
      );
      localStorage.setItem(
        'firstTimeLogin',
        JSON.stringify({ firstTimeLogin: true })
      );
      loader.dismiss();
      this.alertify.presentToast('Welcome back,' + userDoc[0]['name'] + ' 😄');
      return;
    }

    this.alertify.presentToast('Creating new account');
    let newUserData = {
      name: '',
      email: '',
      phoneNumber: phone || '',
      photoURL: '',
      uid: '',
      type: 'customer',
    };
    await addDoc(collection(this.firestore, 'users'), newUserData).then(
      (docRef) => {
        this.dataProvider.currentUser = {
          user: { uid: docRef.id },
          userData: { ...newUserData, uid: docRef.id },
        };
        this.dataProvider.currentUser$.next(this.dataProvider.currentUser);
        localStorage.setItem(
          'user',
          JSON.stringify(this.dataProvider.currentUser)
        );
        localStorage.setItem(
          'firstTimeLogin',
          JSON.stringify({ firstTimeLogin: true })
        );
      }
    );
    loader.dismiss();
    if (newUserData && newUserData['name']) {
      this.alertify.presentToast('Welcome, ' + newUserData['name'] + ' 😄');
    }
    return;
  }
}
