import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationBackService } from 'src/app/navigation-back.service';

@Component({
  selector: 'app-header-with-back',
  templateUrl: './header-with-back.component.html',
  styleUrls: ['./header-with-back.component.scss'],
})
export class HeaderWithBackComponent  implements OnInit {
  @Input() title!:string;
  @Input() showNotificationIcon:boolean = false;
  constructor(
    public _navigationBack : NavigationBackService,
    private router: Router,) { }

  ngOnInit() {}
  notification(){}
  onBackButtonClick(){
    const previousUrlArray = this._navigationBack.getPreviourUrl();
    const previousUrl = previousUrlArray[previousUrlArray.length - 2];
    this._navigationBack.setDataAfterNavigation();
    this.router.navigate([previousUrl]);
  }

}
