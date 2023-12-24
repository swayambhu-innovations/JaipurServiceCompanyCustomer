import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
} from '@angular/fire/firestore';
import { DataProviderService } from '../../core/data-provider.service';
import { ReplaySubject, Subject, async, debounceTime } from 'rxjs';
import { Category } from '../../core/types/category.structure';
import { where } from 'firebase/firestore';

@Injectable({
  providedIn: 'root', 
})
export class HomeService {
  mainCategories: ReplaySubject<Category[]> = new ReplaySubject<Category[]>(1);
  refetchCategories: Subject<void> = new Subject<void>();

  constructor(
    private firestore: Firestore,
    private dataProvider: DataProviderService
  ) {
    this.mainCategories = this.dataProvider.mainCategories;
      this.dataProvider.selectedAddress.subscribe(address=>{
        if(address){
          this.fetchData(address.area.serviceCatalogue);
        }else{
          this.fetchData("1OtfZ7RzJOyRWSGpTR3t");
        }
        
      })
    this.refetchCategories.pipe(debounceTime(200)).subscribe(() => {
    
    });
    
  }

  async fetchData(serviceCatalogueId:string) {
      let serverCatDb=doc(this.firestore, 'service-catalogue',serviceCatalogueId);
      const docSnap = await getDoc(serverCatDb);
        if (docSnap.exists()) {
          this.mainCategories.next(await this.getMainCategories(serviceCatalogueId));
        }
  }
  async getMainCategories(serviceCatalogueId:string) {
    return await Promise.all(
      (
        await getDocs(collection(this.firestore, 'service-catalogue', serviceCatalogueId, 'categories'))
      ).docs.map(async (mainCategory) => {
        return {
          id: mainCategory.id,
          name: mainCategory.data()['name'],
          image: mainCategory.data()['image'],
          description:mainCategory.data()['description'],
          subCategories: await this.getSubCategories(serviceCatalogueId,mainCategory.id),
        };
      })
    );
  }

  async getServices(serviceCatalogueId:string,mainCategoryId: string, subCategoryId: string) {
    return await Promise.all(
      (
        await getDocs(
          collection(
            this.firestore,
            'service-catalogue',
            serviceCatalogueId,
            'categories',
            mainCategoryId,
            'categories',
            subCategoryId,
            'services'
          )
        )
      ).docs.map((service) => {
        return {
          id: service.id,
          name: service.data()['name'],
          image: service.data()['image'],
          video: service.data()['video'],
          color:service.data()['color'],
          hsnCode:service.data()['hsnCode'],
          reviewEditable:service.data()['reviewEditable'],
          description: service.data()['description'],
          enabled: service.data()['enabled'],
          allowReviews: service.data()['allowReviews'],
          taxes:service.data()['taxes'],
          tags:service.data()['tags'],
          taxType:service.data()['taxType'],
          discounts: service.data()['discounts'],
          variants: service.data()['variants'],
        };
      })
    );
  }
  async getTaxes(taxeIds:string) {
   
   // let ids = JSON.parse(taxeIds);
    let citiesRef = collection(this.firestore,"taxes");
    const q = query(citiesRef, where('id', 'in', taxeIds));
    if(taxeIds.length > 0){
      console.log("taxes ids..........: ",taxeIds)
      return await Promise.all(
        ( await getDocs(q)).docs.map(async (taxes) => {
          console.log("taxes details..........: ",taxes.data())
          return {
            id: taxes.id,
            name: taxes.data()['name'],
            rate: taxes.data()['rate'],
            type:taxes.data()['type'],
            createdOn:taxes.data()['createdOn'],
            lastUpdated:taxes.data()['lastUpdated']
          };
        })
      );
    }else{
     return [];
    }
   
  }
  async getSubCategories(serviceCatalogueId:string,mainCategoryId: string) {
    return await Promise.all(
      (
        await getDocs(
          collection(this.firestore,'service-catalogue',serviceCatalogueId, 'categories', mainCategoryId, 'categories')
        )
      ).docs.map(async (subCategory) => {
        return {
          id: subCategory.id,
          name: subCategory.data()['name'],
          image: subCategory.data()['image'],
          description: subCategory.data()['description'],
          services: await this.getServices(serviceCatalogueId,mainCategoryId, subCategory.id),
        };
      })
    );
  }

  getBanners(){
    return getDocs(collection(this.firestore,'Banner'));
  }
  getCategory(){ // added by ronak
    return getDocs(collection(doc(this.firestore, "service-catalogue", "1OtfZ7RzJOyRWSGpTR3t"), 'categories'));
    }
 // till here
 getCurrentUser(){
  return getDocs(collection(this.firestore,'users/${userId}/'))
 }
  getService(mainCategoryId: string, subCategoryId: string, serviceId: string) {
    return getDoc(
      doc(
        this.firestore,
        'service-catalogue',

        'categories',
        mainCategoryId,
        'categories',
        subCategoryId,
        'services',
        serviceId
      )
    );
  } 

  getRecentBookings(){
    return getDocs(collection(doc(this.firestore, "users", this.dataProvider.currentUser!.user.uid), 'bookings'));
  }

  
}
