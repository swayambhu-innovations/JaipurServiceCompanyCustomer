import { Injectable } from '@angular/core';
import { ApplicationVerifier, Auth, User, UserCredential, signInWithPhoneNumber } from '@angular/fire/auth';
import { Firestore, docData } from '@angular/fire/firestore';
import { addDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { DataProviderService } from './data-provider.service';
import { AlertsAndNotificationsService } from '../alerts-and-notifications.service';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ProfileService } from '../authorized/db_services/profile.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private profileService:ProfileService, private router:Router,public auth:Auth,private firestore:Firestore,private dataProvider:DataProviderService,private alertify:AlertsAndNotificationsService,private loadingController: LoadingController) {
    this.dataProvider.checkingAuth = true;
    this.auth.onAuthStateChanged((user)=>{
        if(user){
          this.dataProvider.loggedIn = true;
          this.getUserData(user.uid).subscribe((userData)=>{
            this.dataProvider.currentUser = {
              user:user,
              userData:userData
            }
            if(userData.name.length ===0){
                this.router.navigate(['/authorized/profile/profile-info'],{ queryParams: { "from":"auth" } });
            }else{
              this.router.navigate(['../../authorized/home']);
            }
            this.dataProvider.checkingAuth = false;
          });
        } else {
          this.dataProvider.loggedIn = false;
          this.dataProvider.checkingAuth = false;
        }
    })
  }
 
  updateUserDate(){
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
          if(userData.name.length ===0){
            this.router.navigate(['/authorized/profile/profile-info'],{ queryParams: { "from":"auth" } });
          }else{
            this.router.navigate(['../../authorized/home']);
          }
        });
      } else {
        this.dataProvider.loggedIn = false;
        this.dataProvider.checkingAuth = false;
      }
      // if(user){
      //   this.dataProvider.currentUser = {
      //     user:user,
      //     userData:{}
      //   }
      //   this.dataProvider.loggedIn = true;
      //   this.profileService.getUsers().then(async (userDetails) => {
      //     this.dataProvider.checkingAuth = false;
      //     console.log("usr deti......: ",userDetails)
      //     if(userDetails.length ===0){
      //      this.router.navigate(['/authorized/profile/profile-info'],{ queryParams: { "from":"auth" } })
      //     }else{
      //       this.router.navigate(['../../authorized/home']);
      //       this.dataProvider.currentUser = {
      //         user:user,
      //         userData:userDetails[0]
      //       }
      //     }
      //    });
      // } else {
      //   this.dataProvider.loggedIn = false;
      //   this.dataProvider.checkingAuth = false;
      // }
    });
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
      type:'customer'
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
