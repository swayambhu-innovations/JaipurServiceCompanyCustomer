import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationBackService {
  public previousUrlArray: any[] = [];
  isAddressSubscription$ = new Subject<void>();
  constructor() { }
  addPreviousUrl(previousUrl: string) {
    this.previousUrlArray.push(previousUrl);
  }
  getPreviourUrl(){
    return this.previousUrlArray;
  }
  setDataAfterNavigation(){
    this.previousUrlArray.pop();
  }

  destroyAddressSubscription(){
    this.isAddressSubscription$.next();
    this.isAddressSubscription$.complete();
  }

  invokeAddressSubscription(){
    this.isAddressSubscription$ = new Subject<void>();
  }
}
