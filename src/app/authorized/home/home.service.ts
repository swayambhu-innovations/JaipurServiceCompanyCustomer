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
import { ReplaySubject, Subject, debounceTime } from 'rxjs';
import { Category } from '../../core/types/category.structure';

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
    this.refetchCategories.pipe(debounceTime(200)).subscribe(() => {
      this.fetchData();
    });
    this.fetchData();
  }

  async fetchData() {
    this.mainCategories.next(await this.getMainCategories());
  }

  async getMainCategories() {
    return await Promise.all(
      (
        await getDocs(collection(this.firestore, 'categories'))
      ).docs.map(async (mainCategory) => {
        return {
          id: mainCategory.id,
          name: mainCategory.data()['name'],
          image: mainCategory.data()['image'],
          description:mainCategory.data()['description'],
          subCategories: await this.getSubCategories(mainCategory.id),
        };
      })
    );
  }

  async getServices(mainCategoryId: string, subCategoryId: string) {
    return await Promise.all(
      (
        await getDocs(
          collection(
            this.firestore,
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
          description: service.data()['description'],
          enabled: service.data()['enabled'],
          allowReviews: service.data()['allowReviews'],
          taxes: service.data()['taxes'],
          discounts: service.data()['discounts'],
          variants: service.data()['variants'],
        };
      })
    );
  }

  async getSubCategories(mainCategoryId: string) {
    return await Promise.all(
      (
        await getDocs(
          collection(this.firestore, 'categories', mainCategoryId, 'categories')
        )
      ).docs.map(async (subCategory) => {
        return {
          id: subCategory.id,
          name: subCategory.data()['name'],
          image: subCategory.data()['image'],
          description: subCategory.data()['description'],
          services: await this.getServices(mainCategoryId, subCategory.id),
        };
      })
    );
  }

  getBanners(){
    return getDocs(collection(this.firestore,'Banner'));
  }

  getService(mainCategoryId: string, subCategoryId: string, serviceId: string) {
    return getDoc(
      doc(
        this.firestore,
        'categories',
        mainCategoryId,
        'categories',
        subCategoryId,
        'services',
        serviceId
      )
    );
  } 

  
}
