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
import { LoadingController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ProfileService } from '../authorized/db_services/profile.service';
import { Network } from '@capacitor/network';
import { from, map } from 'rxjs';
import { AddressService } from '../authorized/db_services/address.service';
import { CartService } from '../authorized/cart/cart.service';
import { LoginPopupComponent } from '../widgets/login-popup/login-popup.component';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isProfileUpdated: boolean = false;
  loginCheckTimeout: any;
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
    private modalController: ModalController,
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
       await this.scheduleLoginPrompt();
        this.router.navigate(['../../authorized/home']);
      }
      // if (!this.dataProvider.currentUser) {
        
      // }
    console.log("step1")
      // this.scheduleLoginPrompt();
    }
  }
  
   scheduleLoginPrompt() {
    console.log("step2")
        this.loginCheckTimeout = setTimeout(async () => {
          await this.openLoginModal();
        }, 120000); // 2 minutes
      }
    
      private async openLoginModal() {
        const modal = await this.modalController.create({
          component: LoginPopupComponent, 
          componentProps: { isOpen: true },
          initialBreakpoint: 0.7,
          breakpoints: [0, 1],
          backdropDismiss: false,
        });
        await modal.present();

            const { data } = await modal.onWillDismiss();
        
            if (data && data.loggedIn) {
              this.router.navigate(['/login']); 
            }
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
    let tempBooking, cart;
    tempBooking = localStorage.getItem('cart');
    if (tempBooking) cart = [...JSON.parse(tempBooking)];
    this.cartService.addLocalHostCart(
      this.dataProvider.currentUser!.userData.uid,
      cart
    );
    this.getAddresses(this.dataProvider.currentUser!.userData.uid).then(
      (result) => {
        const addresses = result.docs.map((address: any) => {
          return { ...address.data(), id: address.id };
        });
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
      }
    );
    loader.dismiss();
    if (newUserData && newUserData['name']) {
      this.alertify.presentToast('Welcome, ' + newUserData['name'] + ' 😄');
    }
    return;
  }
}








// import { Injectable } from '@angular/core';
// import {
//   ApplicationVerifier,
//   Auth,
//   signInWithPhoneNumber,
// } from '@angular/fire/auth';
// import { Firestore, collection, getDocs, query, where, addDoc } from '@angular/fire/firestore';
// import { DataProviderService } from './data-provider.service';
// import { AlertsAndNotificationsService } from '../alerts-and-notifications.service';
// import { LoadingController, ModalController } from '@ionic/angular';
// import { Router } from '@angular/router';
// import { ProfileService } from '../authorized/db_services/profile.service';
// import { Network } from '@capacitor/network';
// import { from, map } from 'rxjs';
// import { AddressService } from '../authorized/db_services/address.service';
// import { CartService } from '../authorized/cart/cart.service';
// import { LoginPopupComponent } from '../widgets/login-popup/login-popup.component';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   private isProfileUpdated: boolean = false;
//   private loginCheckTimeout: any;

//   constructor(
//     private profileService: ProfileService,
//     private router: Router,
//     public auth: Auth,
//     private firestore: Firestore,
//     private dataProvider: DataProviderService,
//     private alertify: AlertsAndNotificationsService,
//     private loadingController: LoadingController,
//     private addressService: AddressService,
//     private cartService: CartService,
//     private modalController: ModalController,
//   ) {
//     this.onAuth();
//   }

//   async onAuth() {
//     if (
//       this.dataProvider.currentUser &&
//       (!this.dataProvider.currentUser.userData)
//     ) {
//       this.getUserData(this.dataProvider.currentUser?.userData['uid'])
//         .subscribe(async (userData) => {
//           let currUser = { uid: userData?.['uid'] };
//           this.dataProvider.currentUser = {
//             user: currUser,
//             userData: userData,
//           };
//           await this.handleNetworkAndRouting(userData);
//         });
//     } else {
//       await this.handleNetworkAndRouting();
//     }
//   }

//   private async handleNetworkAndRouting(userData?: any) {
//     const status = await Network.getStatus();
//     if (!status.connected) {
//       this.router.navigate(['/no-internet']);
//     } else if (!userData || !userData.name) {
//       this.router.navigate(['/authorized/profile/profile-info']);
//     } else {
//       if (!this.isProfileUpdated) {
//         this.router.navigate(['../../authorized/home']);
//       }
//       this.scheduleLoginPrompt();
//     }
//   }

//   private scheduleLoginPrompt() {
//     this.loginCheckTimeout = setTimeout(async () => {
//       await this.openLoginModal();
//     }, 5000); // 5 minutes
//   }

//   private async openLoginModal() {
//     const modal = await this.modalController.create({
//       component: LoginPopupComponent, // Ensure LoginPopupComponent is imported
//       componentProps: { isOpen: true },
//       initialBreakpoint: 0.7,
//       breakpoints: [0, 1],
//       backdropDismiss: false, // Prevent modal dismissal by clicking outside
//     });
//     await modal.present();

//     const { data } = await modal.onWillDismiss();

//     if (data && data.loggedIn) {
//       this.router.navigate(['/login']); // Adjust the route as needed
//     }
//   }

//   cancelLoginPrompt() {
//     if (this.loginCheckTimeout) {
//       clearTimeout(this.loginCheckTimeout);
//       this.loginCheckTimeout = null;
//       console.log('Login prompt canceled.');
//     }
//   }

//   updateUserDate(redirect?: boolean) {
//     this.dataProvider.checkingAuth = true;
//     this.addressService.addAddress(
//       this.dataProvider.currentUser!.userData.uid,
//       this.dataProvider.authLessAddress
//     );
//     this.dataProvider.selectedAddress.next(this.dataProvider.authLessAddress);
//     let tempBooking, cart;
//     tempBooking = localStorage.getItem('cart');
//     if (tempBooking) cart = [...JSON.parse(tempBooking)];
//     this.cartService.addLocalHostCart(
//       this.dataProvider.currentUser!.userData.uid,
//       cart
//     );
//     this.getAddresses(this.dataProvider.currentUser!.userData.uid).then(
//       (result) => {
//         const addresses = result.docs.map((address: any) => {
//           return { ...address.data(), id: address.id };
//         });
//         this.router.navigate(['/authorized/home']);
//       }
//     );
//   }

//   async getAddresses(userId: string) {
//     return await getDocs(
//       collection(this.firestore, 'users', userId, 'addresses')
//     );
//   }

//   getUserData(uid: string) {
//     const userQuery = query(
//       collection(this.firestore, 'users'),
//       where('authId', '==', uid)
//     );
//     return from(getDocs(userQuery)).pipe(
//       map((userDocs) => {
//         if (userDocs.docs.length > 0) {
//           return userDocs.docs[0].data();
//         } else {
//           return null;
//         }
//       })
//     );
//   }

//   async loginWithPhoneNumber(phone: string, appVerifier: ApplicationVerifier) {
//     if (phone.length !== 10) {
//       return Promise.reject(new Error('Invalid Phone Number'));
//     }
//     return signInWithPhoneNumber(this.auth, '+91' + phone, appVerifier);
//   }

//   async setUserData(phone: string) {
//     const loader = await this.loadingController.create({
//       message: 'Please wait...',
//     });
//     await loader.present();

//     const userDocs = await getDocs(
//       query(
//         collection(this.firestore, 'users'),
//         where('phoneNumber', '==', phone)
//       )
//     );

//     const userDoc = userDocs.docs.map((user) => {
//       return { ...user.data(), uid: user.id };
//     });

//     if (userDoc[0]) {
//       this.dataProvider.currentUser = {
//         user: { uid: userDoc[0]['uid'] },
//         userData: userDoc[0],
//       };
//       this.dataProvider.currentUser$.next(this.dataProvider.currentUser);
//       loader.dismiss();
//       this.alertify.presentToast(`Welcome back, ${userDoc[0]['name']} 😄`);
//       return;
//     }

//     const newUserData = {
//       name: '',
//       email: '',
//       phoneNumber: phone || '',
//       photoURL: '',
//       uid: '',
//       type: 'customer',
//     };
//     await addDoc(collection(this.firestore, 'users'), newUserData).then(
//       (docRef) => {
//         this.dataProvider.currentUser = {
//           user: { uid: docRef.id },
//           userData: { ...newUserData, uid: docRef.id },
//         };
//         this.dataProvider.currentUser$.next(this.dataProvider.currentUser);
//       }
//     );
//     loader.dismiss();
//     this.alertify.presentToast(`Welcome, ${newUserData['name']} 😄`);
//   }
// }
