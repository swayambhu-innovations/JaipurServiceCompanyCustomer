import { Component, OnInit } from '@angular/core';
import { DataProviderService } from '../../core/data-provider.service';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import {
  Service,
  SubCategory,
  Category,
} from '../../core/types/category.structure';

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
      //  console.log(params['mainCategoryId'],mainCategories)
      this.matchingMainCategory = mainCategories.find(
        (mainCategory) => mainCategory.id == this.mainCatId
      );
     // console.log(params['subCategoryId'],this.matchingMainCategory)
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
      console.log("this.matchingSubCategory.......:",this.matchingSubCategory)
      if (!this.matchingSubCategory) {
        console.log(this.matchingMainCategory + "subcategory");
       // this.router.navigate(['/authorized/home']);
        return;
      }
      this.services = this.matchingSubCategory.services;
      console.log(this.services);
    });
  }

  ngOnInit() {
    //console.log("result services, ",this.services)
  }
}
