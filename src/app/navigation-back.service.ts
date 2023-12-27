import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationBackService {
  public previousUrlArray: any[] = [];
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
