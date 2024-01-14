import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, getDocs, updateDoc } from '@angular/fire/firestore';
import { UserNotification } from './notification.structure';
import { DataProviderService } from 'src/app/core/data-provider.service';
import { limit, orderBy, query, writeBatch } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserNotificationService {

  constructor(private firestore:Firestore,public dataProvider:DataProviderService,) { }
  unreadNotifications: any[] = [];
  allNotifications: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  notificationBase = {
    createdAt: new Date(),
    read: false,
  } 
  message = {
    bookingAllotted: {
      title: 'New Booking',
      body: 'A new booking is allotted to you',
      icon: '',
      ...this.notificationBase
    },
    bookingAccepted: {
      title: 'Booking Accepted',
      body: 'Your booking has been accepted by the Agent',
      icon: '',
      ...this.notificationBase
    },
    bookingOTPVerified: {
      title: 'Booking OTP Verified',
      body: 'Your booking OTP is verified',
      icon: '',
      ...this.notificationBase
    },
    bookingCompleted: {
      title: 'Booking Completed',
      body: 'Your booking has been completed by the Agent',
      icon: '',
      ...this.notificationBase
    },
    bookingRejected: {
      title: 'Booking Rejected',
      body: 'Your booking has been rejected',
      icon: '',
      ...this.notificationBase
    }
  }
  addAgentNotification(agentId: string, notification: UserNotification){
    return addDoc(collection(this.firestore, 'agents', agentId, 'notifications'), notification);
  }

  addUserNotification(userId: string, notification: UserNotification){
    return addDoc(collection(this.firestore, 'users', userId, 'notifications'), notification);
  }

  getCurrentUserNotification(){
    return getDocs(query(collection(this.firestore,'users',this.dataProvider.currentUser!.user.uid,'notifications'),orderBy("createdAt",'desc'),limit(100)));
  }


  async markAllNotificationsAsRead(): Promise<void> {
    const notificationsQuery = query(
      collection(this.firestore, 'users', this.dataProvider.currentUser!.user.uid, 'notifications')
    );
    const querySnapshot = await getDocs(notificationsQuery);
    const batch = writeBatch(this.firestore);
    querySnapshot.forEach((doc1: any) => {
      const notificationRef = doc(
        this.firestore,
        'users',
        this.dataProvider.currentUser!.user.uid,
        'notifications',
        doc1.id
      );
      batch.update(notificationRef, { read: true });
    });
    await batch.commit();
  }

  deleteNotification(notificationId: string): Promise<void> {
    return deleteDoc(
      doc(this.firestore, 'users', this.dataProvider.currentUser!.user.uid, 'notifications', notificationId)
    );
  }
  
}