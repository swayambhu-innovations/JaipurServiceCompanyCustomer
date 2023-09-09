import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs, query } from '@angular/fire/firestore';
import { DataProviderService } from '../data-provider.service';
import { ReplaySubject, Subject, debounceTime } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  mainCategories:ReplaySubject<Category[]>=new ReplaySubject<Category[]>(1);
  refetchCategories:Subject<void>=new Subject<void>();

  constructor(private firestore:Firestore,private dataProvider:DataProviderService) { 
    this.mainCategories = this.dataProvider.mainCategories;
    this.refetchCategories.pipe(debounceTime(200)).subscribe(()=>{
      this.fetchData();
    });
    this.fetchData();
  }

  async fetchData(){
    this.mainCategories.next(await this.getMainCategories());
  }

  async getMainCategories(){
    return await Promise.all((await getDocs(collection(this.firestore,'categories'))).docs.map(async (mainCategory)=>{
      return {
        id:mainCategory.id,
        name:mainCategory.data()['name'],
        image:mainCategory.data()['image'],
        subCategories:await this.getSubCategories(mainCategory.id)
      }
    }));
  }

  async getServices(mainCategoryId:string,subCategoryId:string){
    return await Promise.all((await getDocs(collection(this.firestore,'categories',mainCategoryId,'categories',subCategoryId,'services'))).docs.map((service)=>{
      return {
        id:service.id,
        name:service.data()['name'],
        image:service.data()['image'],
        description:service.data()['description'],
        price:service.data()['price']
      }
    }));
  }

  async getSubCategories(mainCategoryId:string){
    return await Promise.all((await getDocs(collection(this.firestore,'categories',mainCategoryId,'categories'))).docs.map(async (subCategory)=>{
      return {
        id:subCategory.id,
        name:subCategory.data()['name'],
        image:subCategory.data()['image'],
        description:subCategory.data()['description'],
        services:await this.getServices(mainCategoryId,subCategory.id)
      }
    }));
  }

  getService(mainCategoryId:string,subCategoryId:string,serviceId:string){
    return getDoc(doc(this.firestore,'categories',mainCategoryId,'categories',subCategoryId,'services',serviceId));
  }

  getBanners(){
    return getDocs(collection(this.firestore,'Banner'));
  }

}

export interface Category{
  id:string;
  name:string;
  image:string;
  subCategories:SubCategory[];
}
export interface SubCategory{
  id:string;
  name:string;
  image:string;
  services:Service[];
}
export interface Service{
  id:string;
  name:string;
  image:string;
  description:string;
  price:number;
}