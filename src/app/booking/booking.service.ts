import { Injectable } from '@angular/core';
import { Firestore, doc,collection, getDocs, addDoc } from '@angular/fire/firestore';
import { Review } from './booking.page';


@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(
    private firestore:Firestore
  ) { }

  getAllReviews(){
    return getDocs(collection(this.firestore,'Review'));
  }

  addReview(review:Review){
    addDoc(collection(this.firestore,'Review'),review);
  }
}
