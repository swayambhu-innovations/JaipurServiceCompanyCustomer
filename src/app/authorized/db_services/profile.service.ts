import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, getDocs, updateDoc } from '@angular/fire/firestore';
import { Profile } from '../models/profile.structure';
import { DataProviderService } from 'src/app/core/data-provider.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  addresses:Profile[] = [];
  fetchedAddresses:Subject<Profile[]> = new Subject<Profile[]>();
  constructor(private firestore:Firestore,private dataProvider:DataProviderService) {
    if(this.dataProvider.currentUser !== undefined)
    collectionData(collection(this.firestore, 'costomer-profiles', this.dataProvider.currentUser!.user.uid, 'costomerLoginUID')).subscribe((addresses:any)=>{
      this.addresses = addresses;
      this.fetchedAddresses.next(this.addresses);
    })
  }
 async getCostomer(){
  
    return await Promise.all(
      (
        await getDocs(
          collection(this.firestore , 'costomer-profiles', this.dataProvider.currentUser!.user.uid, 'costomerLoginUID')
        )
      ).docs.map(async (user) => {
        return user.data();
      })
    );
  }

  addCostomer(userId:string, address:any){

    return addDoc(collection(this.firestore, 'costomer-profiles', userId, 'costomerLoginUID'), address);
  }

  deleteCostomer(userId:string, addressId:string){
    return deleteDoc(doc(this.firestore, 'costomer-profiles', userId, 'costomerLoginUID', addressId));
  }

  editCostomer(userId:string, addressId:string, address:any){
    return updateDoc(doc(this.firestore, 'costomer-profiles', userId, 'costomerLoginUID', addressId), address);
  }
}
