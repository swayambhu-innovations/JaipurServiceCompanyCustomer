import { Injectable } from '@angular/core';
import { Firestore, doc,collection, getDocs, addDoc, setDoc, collectionData, docData } from '@angular/fire/firestore';
import { Review } from './booking.page';
import { Booking } from './booking.structure';
import { DataProviderService } from 'src/app/core/data-provider.service';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BookingService {
  bookings:Booking[] = [];
  bookingsSubject:Subject<Booking[]> = new Subject<Booking[]>();
  constructor(
    private firestore:Firestore,
    private dataProvider:DataProviderService
  ) {
    console.log("Loading bookings");
    collectionData(collection(this.firestore,'users',this.dataProvider.currentUser!.user.uid,'bookings')).subscribe((bookings:any)=>{
      this.bookings = bookings;
      console.log("Bookings loaded",bookings);
      this.bookingsSubject.next(this.bookings);
    })
  }

  getBooking(bookingId:string){
    return docData(doc(this.firestore,'users',this.dataProvider.currentUser!.user.uid,'bookings',bookingId));
  }

  getAllReviews(){
    return getDocs(collection(this.firestore,'Review'));
  }

  addReview(review:Review){
    addDoc(collection(this.firestore,'Review'),review);
  }

  async addBooking(booking:Booking,userId:string){
    console.log(booking);
    debugger
    let res = await setDoc(doc(this.firestore,'users',userId,'bookings',booking.id!),booking);
    return res;
  }

  getBookings(userId:string){
    return getDocs(collection(this.firestore,'users',userId,'bookings'));
  }
}
