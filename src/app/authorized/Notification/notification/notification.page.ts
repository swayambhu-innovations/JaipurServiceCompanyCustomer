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
      this.isLoaded = true;
      loader.dismiss();
    });
  }

}
