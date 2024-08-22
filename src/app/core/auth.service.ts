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
import { DataProviderService } from './data-provider.service';
import { AlertsAndNotificationsService } from '../alerts-and-notifications.service';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ProfileService } from '../authorized/db_services/profile.service';
import { Network } from '@capacitor/network';
import { from, map } from 'rxjs';
import { AddressService } from '../authorized/db_services/address.service';
import { CartService } from '../authorized/cart/cart.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isProfileUpdated: boolean = false;
  constructor(
    private profileService: ProfileService,
    private router: Router,
    public auth: Auth,
    private firestore: Firestore,
    private dataProvider: DataProviderService,
    private alertify: AlertsAndNotificationsService,
    private loadingController: LoadingController,
    private addressService: AddressService,
    private cartService: CartService
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
        this.router.navigate(['../../authorized/home']);
      }
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
      }
    );
    loader.dismiss();
    if (newUserData && newUserData['name']) {
      this.alertify.presentToast('Welcome, ' + newUserData['name'] + ' 😄');
    }
    return;
  }
}
