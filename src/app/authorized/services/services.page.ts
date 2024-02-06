import { Component, OnInit, ViewChild } from '@angular/core';
import { DataProviderService } from '../../core/data-provider.service';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import {
  Service,
  SubCategory,
  Category,
} from '../../core/types/category.structure';
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'app-services',
  templateUrl: './services.page.html',
  styleUrls: ['./services.page.scss'],
})
export class ServicesPage implements OnInit {
  services: Service[] = [];
  mainCatId = "";
  subCatId = "";
  matchingSubCategory: SubCategory | undefined;
  matchingMainCategory: Category | undefined;

  //modal
  deviceInfo:any
  isModalOpen:boolean = false;
  mobileView: boolean = true;
  @ViewChild(IonModal) modal: IonModal;

  constructor(
    private dataProvider: DataProviderService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.activatedRoute.params.subscribe(async (params) => {
      let mainCategories = await firstValueFrom(
        this.dataProvider.mainCategories
      );
      this.mainCatId = params['mainCategoryId'];
      this.matchingMainCategory = mainCategories.find(
        (mainCategory) => mainCategory.id == this.mainCatId
      );
      if (!this.matchingMainCategory) {
        this.router.navigate(['/authorized/home']);
        return;
      }
      this.subCatId = params['subCategoryId'].trim()
      this.matchingSubCategory = this.matchingMainCategory.subCategories.find(
        (subCategory) => {
          return subCategory.id == this.subCatId;
        }
      );
      if (!this.matchingSubCategory) {
        return;
      }
      
      const sortedSubCategory = this.matchingSubCategory.services.sort((a,b) => {
        return a.variants[0].price - b.variants[0].price;
      });

      this.services = sortedSubCategory;
    });
  }

  ngOnInit() {
  }

  //modal
  ionViewDidEnter(){
    this.systeminfo();
    console.log(this.dataProvider.deviceInfo);
  }

  ionViewDidLeave(){
    this.isModalOpen = false;
    this.modal.dismiss(null);
  }

   systeminfo(){
    if(this.dataProvider.deviceInfo.deviceType === "desktop"){
      this.isModalOpen = true;
      this.mobileView = false;
    }
  }
}
