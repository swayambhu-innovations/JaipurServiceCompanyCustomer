import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationBackService {
  public previousUrlArray: any[] = [];
  isAddressSubscription$:boolean = true;
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
}
