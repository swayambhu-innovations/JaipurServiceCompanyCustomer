import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { ConfirmationResult, User } from '@angular/fire/auth';
import { Category } from './types/category.structure';

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {
  mainCategories:ReplaySubject<Category[]>=new ReplaySubject<Category[]>(1);
  loggedIn:boolean=false;
  checkingAuth:boolean=true;
  loginConfirmationResult:ConfirmationResult|undefined;
  currentUser:{
    user:User,
    userData:any;
  }|undefined;
  constructor() { }


}
