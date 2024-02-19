import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, getDocs, setDoc, updateDoc } from '@angular/fire/firestore';
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
 async getUsers(){
    return await Promise.all(
      (
        await getDocs(
          collection(this.firestore , 'users', this.dataProvider.currentUser!.user.uid)
        )
      ).docs.map(async (user) => {
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
    return setDoc(doc(this.firestore, 'users', userId), profileDetails!);
  }

  deleteUsers(userId:string, profileId:string){
    return deleteDoc(doc(this.firestore, 'users', userId, profileId));
  }

  editUsers(userId:string, profileId:string, profileDetails:any){
    return updateDoc(doc(this.firestore, 'users', userId), profileDetails);
  }

  async updatePic(photoUrl:File,uid: string ) {
    let loader = await this.loadingController.create({
      message: 'updating Coustomer Details.........',
    });
    let response:any;
    try {
         await this.fileService.uploadFile(
          photoUrl,
          `users/${uid}/profile`,
          photoUrl.name,
        ).then((respose:any)=>{
          response = respose;
        }).catch((error:any)=>{
          console.log("error File........: ", JSON.stringify(error))
        });
      await updateDoc(doc(this.firestore, 'users', uid), {
        photoUrl:response
      });
      
      loader.dismiss();
      return response;
    } catch (error) {
      console.log("error File. final.......: ", JSON.stringify(error))
      loader.dismiss();
      throw error;
    }
  }
}
