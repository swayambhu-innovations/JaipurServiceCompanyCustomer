import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, getDocs, updateDoc } from '@angular/fire/firestore';
import { Profile } from '../models/profile.structure';
import { DataProviderService } from 'src/app/core/data-provider.service';
import { Subject, of } from 'rxjs';
import { FileService } from './file.service';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  profileDetailses:Profile[] = [];
  fetchedprofileDetailses:Subject<Profile[]> = new Subject<Profile[]>();
  constructor(private firestore:Firestore,private dataProvider:DataProviderService,
    private loadingController: LoadingController,
    private fileService:FileService) {
    if(this.dataProvider.currentUser !== undefined)
    collectionData(collection(this.firestore, 'users', this.dataProvider.currentUser!.user.uid, 'profileId')).subscribe((profileDetailses:any)=>{
      this.profileDetailses = profileDetailses;
      this.fetchedprofileDetailses.next(this.profileDetailses);
    })
  }
 async getUsers(){console.log("this.dataProvider.currentUser!.user.uid: ",this.dataProvider.currentUser!.user.uid)
    return await Promise.all(
      (
        await getDocs(
          collection(this.firestore , 'users', this.dataProvider.currentUser!.user.uid)
        )
      ).docs.map(async (user) => {
        console.log("user data from server........:",user.id )
        return {
            name : user.data().name,
            gender: user.data().gender,
            uid:user.data().uid,
            dateofbirth:user.data().dateofbirth,
        }
      })
    );
  }

  addUsers(userId:string, profileDetails:any){
    return addDoc(collection(this.firestore, 'users', userId), profileDetails);
  }

  deleteUsers(userId:string, profileId:string){
    return deleteDoc(doc(this.firestore, 'users', userId, profileId));
  }

  editUsers(userId:string, profileId:string, profileDetails:any){
    return updateDoc(doc(this.firestore, 'users', userId), profileDetails);
  }

  async updatePic(photoUrl:any,uid: string ) {
    let loader = await this.loadingController.create({
      message: 'updating Coustomer Details.........',
    });
    try {
      if (photoUrl instanceof File) {
        photoUrl = await this.fileService.uploadFile(
          photoUrl,
          `users/${uid}/profile`,
          'Profile Picture',
        );
      }
      await updateDoc(doc(this.firestore, 'users', uid), {
        photoUrl:photoUrl
      });
      
      await loader.dismiss();
      return photoUrl;
    } catch (error) {
      await loader.dismiss();
      throw error;
    }
  }
}
