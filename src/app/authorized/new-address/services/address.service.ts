import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  constructor(private firestore: Firestore) {}

  loadStates() {
    return getDocs(collection(this.firestore, 'areas'));
  }

  loadCities(stateId: string) {
    return getDocs(collection(this.firestore, 'areas', stateId, 'cities'));
  }

  loadAreas(stateId: string, cityId: string) {
    return getDocs(
      collection(this.firestore, 'areas', stateId, 'cities', cityId, 'areas'),
    );
  }
}
