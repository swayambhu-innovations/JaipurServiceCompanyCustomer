import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, getDocs, updateDoc } from '@angular/fire/firestore';
import { Address } from './address.structure';
import { DataProviderService } from 'src/app/core/data-provider.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  addresses:Address[] = [];
  selectedAddress:Address;
  fetchedAddresses:Subject<Address[]> = new Subject<Address[]>();
  constructor(private firestore:Firestore,private dataProvider:DataProviderService) {
    if(this.dataProvider.currentUser !== undefined && this.dataProvider!.currentUser!.userData?.uid !== undefined)
    collectionData(collection(this.firestore, 'users', this.dataProvider!.currentUser!.userData.uid, 'addresses')).subscribe((addresses:any)=>{
      this.addresses = addresses;
      this.fetchedAddresses.next(this.addresses);
    })
  }

  getAddresses(userId:string){
    return getDocs(collection(this.firestore, 'users', userId, 'addresses'))
  }

  addAddress(userId:string, address:any){
    return addDoc(collection(this.firestore, 'users', userId, 'addresses'), address)
  }

  deleteAddress(userId:string, addressId:string){
    return deleteDoc(doc(this.firestore, 'users', userId, 'addresses', addressId))
  }

  editAddress(userId:string, addressId:string, address:any){
    return updateDoc(doc(this.firestore, 'users', userId, 'addresses', addressId), address)
  }
}
