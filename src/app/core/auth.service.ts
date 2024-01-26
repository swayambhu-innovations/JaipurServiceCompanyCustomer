import { Injectable } from '@angular/core';
import { ApplicationVerifier, Auth, User, UserCredential, signInWithPhoneNumber } from '@angular/fire/auth';
import { Firestore, docData } from '@angular/fire/firestore';
import { addDoc, collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { DataProviderService } from './data-provider.service';
import { AlertsAndNotificationsService } from '../alerts-and-notifications.service';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ProfileService } from '../authorized/db_services/profile.service';
import { Network } from '@capacitor/network';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isProfileUpdated:boolean = false;
  constructor(
    private profileService:ProfileService, 
    private router:Router,
    public auth:Auth,
    private firestore:Firestore,
    private dataProvider:DataProviderService,
    private alertify:AlertsAndNotificationsService,
    private loadingController: LoadingController) {
    this.dataProvider.checkingAuth = true;
    this.auth.onAuthStateChanged((user)=>{
        if(user){
          this.dataProvider.loggedIn = true;
          this.getUserData(user.uid).subscribe(async (userData)=>{
            this.dataProvider.currentUser = {
              user:user,
              userData:userData
            }
            this.dataProvider.currentUser$.next({
              user:user,
              userData:userData
            });
            const status = await Network.getStatus();
            if(!status.connected){
              this.router.navigate(['/no-internet']);
            }
            else if(!userData || !userData.name){
              this.router.navigate(['/authorized/profile/profile-info']);
            }else{
              if(!this.isProfileUpdated){
                this.router.navigate(['../../authorized/home']);
              }
            }
            this.dataProvider.checkingAuth = false;
            
          });
        } else {
          this.dataProvider.loggedIn = false;
          this.dataProvider.checkingAuth = false;
        }
    })
  }
 
  updateUserDate(redirect?: boolean){
    this.dataProvider.checkingAuth = true;
    this.auth.onAuthStateChanged((user)=>{
      if(user){
        this.dataProvider.loggedIn = true;
        this.getUserData(user.uid).subscribe((userData)=>{
          this.dataProvider.currentUser = {
            user:user,
            userData:userData
          }
          this.getAddresses(this.dataProvider.currentUser!.user.uid).then(result=>{
            const addresses = result.docs.map((address:any) => {
              return { ...address.data(),id: address.id };
            });
            if(addresses.length > 0){
              this.router.navigate(['/authorized/profile']);
            }
            else{
              this.router.navigate(['/authorized/new-address']);
            }
          });
          this.dataProvider.checkingAuth = false;
        });
      } else {
        this.dataProvider.loggedIn = false;
        this.dataProvider.checkingAuth = false;
      }
    });
  }
  async getAddresses(userId:string){
    return (await getDocs(collection(this.firestore, 'users', userId, 'addresses')));
  }

  getUserData(uid:string){
    return docData(doc(this.firestore,'users',uid));
  }

  async loginWithPhoneNumber(phone:string,appVerifier:ApplicationVerifier){
    if(phone.length != 10){
      return Promise.reject(new Error("Invalid Phone Number"));
    }
    return signInWithPhoneNumber(this.auth,'+91'+phone,appVerifier);
  }

  async setUserData(user:User){
    let loader = await this.loadingController.create({message:'Please wait...'});
    loader.present();
    let userDoc = await getDoc(doc(this.firestore,'users',user.uid));
    if(userDoc.exists()){
      this.dataProvider.currentUser = {
        user:user,
        userData:userDoc.data()
      }
      loader.dismiss();
      //this.alertify.presentToast("Welcome back,"+user.displayName+" 😄");
      return
    }
    this.alertify.presentToast("Creating new account");
    let newUserData = {
      name:user.displayName || '',
      email:user.email || '',
      phoneNumber:user.phoneNumber || '',
      photoURL:user.photoURL || '',
      uid:user.uid || '',
      type:'customer'
    };
    await setDoc(doc(this.firestore,'users',user.uid),newUserData);
    this.dataProvider.currentUser = {
      user:user,
      userData:newUserData
    }
    loader.dismiss();
    if(user && user.displayName){
      this.alertify.presentToast("Welcome, "+user.displayName+" 😄");
    }
    return
  }
}
