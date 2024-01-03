import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, query, where } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  constructor(private firestore: Firestore) {}

  loadStates() {
    return getDocs(query(collection(this.firestore,'areas'),where("active","==",true)));
  }
  

  loadCities(stateId: string) {
    return getDocs(query(collection(this.firestore,'areas', stateId, 'cities'),where("active","==",true)));
  }

  loadAreas(stateId: string, cityId: string) {
    return getDocs(query(collection(this.firestore, 'areas', stateId, 'cities', cityId, 'areas'),where("active",'==',true)));
  }
}
