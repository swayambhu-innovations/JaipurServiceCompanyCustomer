import { Component, OnInit } from '@angular/core';
import { UserNotificationService } from '../../common/user-notification.service';
import { DataProviderService } from 'src/app/core/data-provider.service';
import { UserNotification } from '../../common/notification.structure';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
  notifications:any[] = [];
  isLoaded: boolean = false;


  notification: boolean = true;
  deletedNotification: string = '';
  myTimeout: any = '';
  showUndoPopup: boolean = false;
  userId: any = '';
  public toastButtons = [
    {
      text: 'Undo',
      role: 'cancel',
      handler: () => {
        this.onUndoDelete();
      },
    },
  ];
  todayNotifications: any = [];
  olderNotifications: any = [];
  constructor(
    private _notificationService: UserNotificationService, 
    public dataProvider:DataProviderService,
    private loadingController: LoadingController) { }

  async ngOnInit() {
    const loader = await this.loadingController.create({message:'Please wait...'});
    loader.present();
    this._notificationService.getCurrentUserNotification().then((notificationRequest) => {
      this.notifications = notificationRequest.docs.map((cart:any) => {
        return { ...cart.data(),id: cart.id };
      });

      const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        this.todayNotifications = this.notifications.filter((notification:any) => { return  notification.createdAt.toDate() >= currentDate && notification.createdAt.toDate() <= new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)});
        this.olderNotifications = this.notifications.filter((notification:any) => { return  notification.createdAt.toDate() <= currentDate });
      this.isLoaded = true;
      loader.dismiss();
    });
  }

  markAllNotificationsAsRead() {
    this._notificationService
      .markAllNotificationsAsRead()
      .then(() => {
        
      })
      .catch((error: any) => {
       
      });
  }

  onDeleteNotification(notificationId: string,notificationType: any) {
    this.myTimeout = setTimeout(() => {
      this._notificationService
        .deleteNotification(notificationId)
        .then(() => {
          if (notificationType == 'older') {
            this.olderNotifications = this.olderNotifications.filter(
              (obj: any) => obj.id !== notificationId
            );
          } else
            this.todayNotifications = this.todayNotifications.filter(
              (obj: any) => obj.id !== notificationId
            );
           
        })
        .catch((error: any) => {
          
        });
    }, 3000);
  }
  onUndoDelete() {
    clearTimeout(this.myTimeout);
  }

}
