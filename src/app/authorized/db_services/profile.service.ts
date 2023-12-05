import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, getDocs, updateDoc } from '@angular/fire/firestore';
import { Profile } from '../models/profile.structure';
import { DataProviderService } from 'src/app/core/data-provider.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  profileDetailses:Profile[] = [];
  fetchedprofileDetailses:Subject<Profile[]> = new Subject<Profile[]>();
  constructor(private firestore:Firestore,private dataProvider:DataProviderService) {
    if(this.dataProvider.currentUser !== undefined)
    collectionData(collection(this.firestore, 'customer-profiles', this.dataProvider.currentUser!.user.uid, 'profileId')).subscribe((profileDetailses:any)=>{
      this.profileDetailses = profileDetailses;
      this.fetchedprofileDetailses.next(this.profileDetailses);
    })
  }
 async getCostomer(){
    return await Promise.all(
      (
        await getDocs(
          collection(this.firestore , 'customer-profiles', this.dataProvider.currentUser!.user.uid, 'profileId')
        )
      ).docs.map(async (user) => {
        //console.log("user data from server........:",user.id  )
        return {
            name : user.data().name,
            dob: user.data().dob,
            gender: user.data().gender,
            profileId:user.id
        }
      })
    );
  }

  addCostomer(userId:string, profileDetails:any){
    return addDoc(collection(this.firestore, 'customer-profiles', userId, 'profileId'), profileDetails);
  }

  deleteCostomer(userId:string, profileId:string){
    return deleteDoc(doc(this.firestore, 'customer-profiles', userId, 'profileId', profileId));
  }

  editCostomer(userId:string, profileId:string, profileDetails:any){
    return updateDoc(doc(this.firestore, 'customer-profiles', userId, 'profileId', profileId), profileDetails);
  }
}
