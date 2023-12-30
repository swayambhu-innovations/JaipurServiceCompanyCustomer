import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, getDocs, updateDoc } from '@angular/fire/firestore';
import { DataProviderService } from 'src/app/core/data-provider.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Address } from '../select-address/address.structure';
import { promises, resolve } from 'dns';
import { rejects } from 'assert';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  addresses:Address[] = [];
  selectedAddres:Address;
  fetchedAddresses:Subject<Address[]> = new Subject<Address[]>();
  constructor(private firestore:Firestore,private dataProvider:DataProviderService,private http: HttpClient,private router:Router) {
    if(this.dataProvider.currentUser!.user.uid !== undefined)
    collectionData(collection(this.firestore, 'users', this.dataProvider.currentUser!.user.uid, 'addresses')).subscribe((addresses:any)=>{
      this.addresses = addresses;
      this.selectedAddres =  this.addresses.filter(address=>address.isDefault)[0];
     // console.log("addresses collectionData....",addresses.length)
      this.fetchedAddresses.next(this.addresses);
      // if(addresses.length == 0){
      //   this.router.navigateByUrl('authorized/new-address', { state: {isfirstTime: true} });
      // }
    })
  }

  async getAddresses(userId:string){

    return (await getDocs(collection(this.firestore, 'users', userId, 'addresses'))).docs;
  }
  async getArea(stateId:string,cityId:string){
    return new Promise((resolve,rejects)=>{
      collectionData(collection(this.firestore, 'areas', stateId, 'cities',cityId,'areas')).subscribe((areas:any)=>{
        resolve(areas);
      });
    });
   
    //return (await getDocs(collection(this.firestore, 'areas', stateId, 'cities',cityId,'areas'))).docs;
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
