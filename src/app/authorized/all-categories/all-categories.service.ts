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
import { BehaviorSubject, ReplaySubject, Subject, async, debounceTime } from 'rxjs';
import { Category } from '../../core/types/category.structure';
import { where } from 'firebase/firestore';
import { Address } from '../select-address/address.structure';

@Injectable({
  providedIn: 'root'
})
export class AllCategoriesService {
  mainCategories: BehaviorSubject<Category[]> = new BehaviorSubject<Category[]>([]);
  refetchCategories: Subject<void> = new Subject<void>();
  selectedAdress:Address;
  constructor(private firestore: Firestore,
    private dataProvider: DataProviderService
    ) {
      this.mainCategories = this.dataProvider.mainCategories;
      this.dataProvider.selectedAddress.subscribe(selectedAdress=>{
        if(selectedAdress.length > 0){
          let currentAddress = selectedAdress.filter(addre=> addre.isDefault);
          if(currentAddress.length > 0 ){
            this.selectedAdress = currentAddress[0]
          }else{
            this.selectedAdress = selectedAdress[0]
          }
        }
      });
    this.refetchCategories.pipe(debounceTime(200)).subscribe(() => {
      this.fetchData();
    });
    this.fetchData();
     }
     async fetchData() {
      if(this.selectedAdress){
        let serverCatDb=doc(this.firestore, 'service-catalogue',this.selectedAdress.selectedArea.serviceCatalogue);
      
        const docSnap = await getDoc(serverCatDb);
          if (docSnap.exists()) {
            this.mainCategories.next(await this.getMainCategories( this.selectedAdress.selectedArea.serviceCatalogue));
          }
      }else{
        let serverCatDb=doc(this.firestore, 'service-catalogue',"1OtfZ7RzJOyRWSGpTR3t");
      
        const docSnap = await getDoc(serverCatDb);
          if (docSnap.exists()) {
            this.mainCategories.next(await this.getMainCategories( "1OtfZ7RzJOyRWSGpTR3t"));
          }
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
          icon: mainCategory.data()['icon'],
          description:mainCategory.data()['description'],
          subCategories: await this.getSubCategories(serviceCatalogueId,mainCategory.id),
        };
      })
    );
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
          icon: subCategory.data()['icon'],
          description: subCategory.data()['description'],
          services: await this.getServices(serviceCatalogueId,mainCategoryId, subCategory.id),
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
          averageRating:service.data()['averageRating'],
        };
      })
    );
  }
  getCategory(){ 
    return getDocs(collection(doc(this.firestore, "service-catalogue", "1OtfZ7RzJOyRWSGpTR3t"), 'categories'));
    }
}
