import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { UserNotificationService } from 'src/app/authorized/common/user-notification.service';
import { NavigationBackService } from 'src/app/navigation-back.service';

@Component({
  selector: 'app-header-with-back',
  templateUrl: './header-with-back.component.html',
  styleUrls: ['./header-with-back.component.scss'],
})
export class HeaderWithBackComponent  implements OnInit {
  @Input() title!:string;
  @Input() showNotificationIcon:boolean = false;
  @Input() showBackButton:boolean = true;

  notifications: any[] = [];
  unreadNotifications: any[] = [];
  constructor(
    public _navigationBack : NavigationBackService,
    private router: Router,
    private _notificationService: UserNotificationService,
  ) {
    
  }

  ngOnInit() {
    this.unreadNotifications = this._notificationService.unreadNotifications;
  }
  notification(){
    this.router.navigate(['authorized/notification']);
  }
  onBackButtonClick(){
    const previousUrlArray = this._navigationBack.getPreviourUrl();
    const previousUrl = previousUrlArray[previousUrlArray.length - 2];
    this._navigationBack.setDataAfterNavigation();
    this.router.navigate([previousUrl]);
  }

}
