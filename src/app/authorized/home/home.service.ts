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
import { Router } from '@angular/router';
import { AddressService } from '../db_services/address.service';
import { LoadingController } from '@ionic/angular';
import { CartService } from '../cart/cart.service';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  public showBanner : boolean = false;
  mainCategories: BehaviorSubject<Category[]> = new BehaviorSubject<Category[]>([]);
  refetchCategories: Subject<void> = new Subject<void>();
  isCatalogueLoaded: boolean = false;

  constructor(
    private firestore: Firestore,
    private dataProvider: DataProviderService,
    private addressService: AddressService,
    private router: Router,
    private loadingController: LoadingController
  ) {

  }

  async fetchData(serviceCatalogueId: string) {
    let serverCatDb = doc(this.firestore, 'service-catalogue', serviceCatalogueId);
    this.dataProvider.selectedCatalog = serviceCatalogueId;
    const docSnap = await getDoc(serverCatDb);
    if (docSnap.exists()) {
      this.isCatalogueLoaded = true;
      const mainCategoryArray = await this.getMainCategories(serviceCatalogueId);
      const activeMainCategories = mainCategoryArray.filter(item => item.enabled);
      const activeMainCategoriesSorted = activeMainCategories.map((category) => {
        category.subCategories.map((subcategory) => {
          subcategory.services.map((service) => {
            const variantsMatching = service?.variants.sort((b, a) => b.price - a.price);
            service.variants = variantsMatching;
            return service;
          });
          return subcategory;
        });
        return category;
      });

      this.dataProvider.mainCategoriesLoaded = true;
      await this.dataProvider.mainCategories.next(activeMainCategoriesSorted);
    }
  }
  async getMainCategories(serviceCatalogueId: string) {
    return await Promise.all(
      (
        await getDocs(collection(this.firestore, 'service-catalogue', serviceCatalogueId, 'categories'))
      ).docs.map(async (mainCategory) => {
        return {
          id: mainCategory.id,
          name: mainCategory.data()['name'],
          image: mainCategory.data()['image'],
          icon: mainCategory.data()['icon'],
          description: mainCategory.data()['description'],
          subCategories: await this.getSubCategories(serviceCatalogueId, mainCategory.id),
          enabled: mainCategory.data()['enabled']
        };
      })
    );
  }

  async getServices(serviceCatalogueId: string, mainCategoryId: string, subCategoryId: string) {
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
          color: service.data()['color'],
          hsnCode: service.data()['hsnCode'],
          reviewEditable: service.data()['reviewEditable'],
          description: service.data()['description'],
          enabled: service.data()['enabled'],
          allowReviews: service.data()['allowReviews'],
          taxes: service.data()['taxes'],
          tags: service.data()['tags'],
          rating:service.data()['rating'],
          taxType: service.data()['taxType'],
          discounts: service.data()['discounts'],
          variants: service.data()['variants'],
          averageRating:service.data()['averageRating'],
        };
      })
    );
  }
  async getTaxes(taxeIds: string) {
    let citiesRef = collection(this.firestore, "taxes");
    const q = query(citiesRef, where('id', 'in', taxeIds));
    if (taxeIds.length > 0) {
      return await Promise.all(
        (await getDocs(q)).docs.map(async (taxes) => {
          return {
            id: taxes.id,
            name: taxes.data()['name'],
            rate: taxes.data()['rate'],
            type: taxes.data()['type'],
            createdOn: taxes.data()['createdOn'],
            lastUpdated: taxes.data()['lastUpdated']
          };
        })
      );
    } else {
      return [];
    }

  }
  async getSubCategories(serviceCatalogueId: string, mainCategoryId: string) {
    return await Promise.all(
      (
        await getDocs(
          collection(this.firestore, 'service-catalogue', serviceCatalogueId, 'categories', mainCategoryId, 'categories')
        )
      ).docs.map(async (subCategory) => {
        return {
          id: subCategory.id,
          name: subCategory.data()['name'],
          image: subCategory.data()['image'],
          icon: subCategory.data()['icon'],
          description: subCategory.data()['description'],
          services: await this.getServices(serviceCatalogueId, mainCategoryId, subCategory.id),
          enabled: subCategory.data()['enabled']
        };
      })
    );
  }
  getCategory() { // added by ronak
    return getDocs(collection(doc(this.firestore, "service-catalogue", "1OtfZ7RzJOyRWSGpTR3t"), 'categories'));
  }
  // till here
  getCurrentUser() {
    return getDocs(collection(this.firestore, 'users/${userId}/'))
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

  getRecentBookings() {
    return getDocs(collection(doc(this.firestore, "users", this.dataProvider.currentUser!.user.uid), 'bookings'));
  }

  showMobileBanner() {
    return getDoc(doc(this.firestore, 'customer-settings', 'mobile-banners'));
  }

  showMobileMiddle() {
    return getDoc(doc(this.firestore, 'customer-settings', 'mobile-banners' , 'sections' , 'middle'));
  }

  showMobileTop() {
    return getDoc(doc(this.firestore, 'customer-settings', 'mobile-banners' , 'sections' , 'top'));
  }

  getTopBanner() {
    return getDocs(collection(this.firestore , 'customer-settings', 'mobile-banners' , 'sections' , 'top','banners'))
  }

  getMiddleBanner() {
    return getDocs(collection(this.firestore , 'customer-settings', 'mobile-banners' , 'sections' , 'middle','banners'))
  }

}
