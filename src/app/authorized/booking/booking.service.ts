import { Injectable } from '@angular/core';
import { Firestore, doc,collection, getDocs, addDoc, setDoc, collectionData,updateDoc, docData, query, collectionGroup } from '@angular/fire/firestore';
import { Review } from './booking.page';
import { Booking } from './booking.structure';
import { DataProviderService } from 'src/app/core/data-provider.service';
import { Subject } from 'rxjs';
import Utils from '../common/util';


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
    collectionData(collection(this.firestore,'users',this.dataProvider.currentUser!.user.uid,'bookings')).subscribe((bookings:any)=>{
      getDocs(query(collectionGroup(this.firestore,'agents'))).then((agentsData) => {
        const agents = agentsData.docs.map((agent) => {
          return { ...agent.data(), id: agent.id };
        });
      
        getDocs(query(collectionGroup(this.firestore,'slots'))).then((slotsData) => {
          const slots = slotsData.docs.map((slot) => {
            return { ...slot.data(), id: slot.id };
          });
          this.bookings = bookings.map((booking) => {
            const agent = agents.find((agent) => booking.assignedAgent == agent.id);
            booking.agentData = agent;
            const timeslot = slots.find((slot) => booking.timeSlot.id == slot.id);
            booking.timeData = timeslot;
            return booking;
          });
          this.bookingsSubject.next(this.bookings);
        });
      });
      
    })
  }

  getBooking(bookingId:string){
    return docData(doc(this.firestore,'users',this.dataProvider.currentUser!.user.uid,'bookings',bookingId));
  }
  getAgentDetails(agentId:string){
    return docData(doc(this.firestore,'agents',agentId));
  }
  getAllReviews(){
    return getDocs(collection(this.firestore,'Review'));
  }

  addReview(review:Review){
    addDoc(collection(this.firestore,'Review'),review);
  }

  async addBooking(booking:Booking,userId:string){
    let res = await setDoc(doc(this.firestore,'users',userId,'bookings',booking.id!),booking);
    return res;
  }

  async updateBookingSlot(userId: string, bookingId: string,booking:any){
    updateDoc(doc(this.firestore, 'users', userId, 'bookings', bookingId), booking);
  }
  async updateServiceRating(catalogId: string, mainCatId: string,subCateId:any,serviceId:string,service:any){
    updateDoc(doc(this.firestore, 'service-catalogue', catalogId, 'categories', mainCatId,'categories',subCateId,'services',serviceId), service);
  }
  getBookings(userId:string){
    return getDocs(collection(this.firestore,'users',userId,'bookings'));
  }

  updateBooking(userId: string, bookingId: string, nextStage: string, agentId?: string, data?: any) {
    let obj: any = {};
    if (nextStage === Utils.stageMaster.acceptancePending.key) {
      obj['assignedAgent'] = agentId;
      obj['allotmentAt'] = new Date();
    } else if (nextStage === Utils.stageMaster.jobAccepted.key) {
      obj['acceptedAt'] = new Date();
    } else if (nextStage === Utils.stageMaster.inProgress.key) {
      obj['otpAt'] = new Date();
      obj['progressAt'] = new Date();
    } else if (nextStage === Utils.stageMaster.completed.key) {
      obj['completedAt'] = new Date();
    } else if (nextStage === Utils.stageMaster.discarded.key) {
      obj['discardedAt'] = new Date();
    }
    obj['stage'] = nextStage;
    if (data) {
      obj = {...obj, ...data}
    }
    console.log("final object..........: ", obj)
    return updateDoc(doc(this.firestore, 'users', userId, 'bookings', bookingId), obj);
  }
}
