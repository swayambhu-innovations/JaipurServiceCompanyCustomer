import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, getDocs, updateDoc } from '@angular/fire/firestore';
import { DataProviderService } from 'src/app/core/data-provider.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Address } from '../select-address/address.structure';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  addresses:Address[] = [];
  fetchedAddresses:Subject<Address[]> = new Subject<Address[]>();
  constructor(private firestore:Firestore,private dataProvider:DataProviderService,private http: HttpClient) {
    if(this.dataProvider.currentUser!.user.uid !== undefined)
    collectionData(collection(this.firestore, 'users', this.dataProvider.currentUser!.user.uid, 'addresses')).subscribe((addresses:any)=>{
      this.addresses = addresses;
      //console.log("addresses............:",addresses)
      this.fetchedAddresses.next(this.addresses);
    })
  }

  async getAddresses(userId:string){
    return getDocs(collection(this.firestore, 'users', userId, 'addresses'));
  }

  addAddress(userId:string, address:any){
    return addDoc(collection(this.firestore, 'users', userId, 'addresses'), address);
  }

  deleteAddress(userId:string, addressId:string){
    return deleteDoc(doc(this.firestore, 'users', userId, 'addresses', addressId));
  }
  
  editAddress(userId:string, addressId:string, address:any){
    return updateDoc(doc(this.firestore, 'users', userId, 'addresses', addressId), address);
  }
  getAreaOnSearch(searchInput: string) {
    return this.http.get(
       `${environment.firebase.functionURL}getAreaOnSearch?searchInput=${searchInput}`
    );
   }
   getAreaDetail(latitude: number, longitude : number){
    return this.http.get(`${environment.firebase.functionURL}getAreaDetail?latitude=${latitude}&longitude=${longitude}`);
  }

  getAreaDetailByPlaceId(placeId: string){
    return this.http.get(`${environment.firebase.functionURL}getAreaDetailByPlaceId?placeId=${placeId}`);
  }

}
