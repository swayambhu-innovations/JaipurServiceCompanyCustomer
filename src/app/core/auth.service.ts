import { Injectable } from '@angular/core';
import { ApplicationVerifier, Auth, User, UserCredential, signInWithPhoneNumber } from '@angular/fire/auth';
import { Firestore, docData } from '@angular/fire/firestore';
import { addDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { DataProviderService } from './data-provider.service';
import { AlertsAndNotificationsService } from '../alerts-and-notifications.service';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public auth:Auth,private firestore:Firestore,private dataProvider:DataProviderService,private alertify:AlertsAndNotificationsService,private loadingController: LoadingController) {
    this.dataProvider.checkingAuth = true;
    this.auth.onAuthStateChanged((user)=>{
      if(user){
        this.dataProvider.loggedIn = true;
        this.getUserData(user.uid).subscribe((userData)=>{
          this.dataProvider.currentUser = {
            user:user,
            userData:userData
          }
          this.dataProvider.checkingAuth = false;
        });
      } else {
        this.dataProvider.loggedIn = false;
        this.dataProvider.checkingAuth = false;
      }
    })
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
      this.alertify.presentToast("Welcome back,"+user.displayName+" 😄");
      return
    }
    this.alertify.presentToast("Creating new account");
    let newUserData = {
      name:user.displayName || '',
      email:user.email || '',
      phoneNumber:user.phoneNumber || '',
      photoURL:user.photoURL || '',
      uid:user.uid || '',
    };
    await setDoc(doc(this.firestore,'users',user.uid),newUserData);
    this.dataProvider.currentUser = {
      user:user,
      userData:newUserData
    }
    loader.dismiss();
    this.alertify.presentToast("Welcome, "+user.displayName+" 😄");
    return
  }
}