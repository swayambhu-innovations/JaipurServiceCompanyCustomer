import { Injectable } from '@angular/core';
import { Category } from './home/home.service';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {
  mainCategories:ReplaySubject<Category[]>=new ReplaySubject<Category[]>(1);
  constructor() { }


}
