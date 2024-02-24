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
  getJobDuration(jobDurationInMin){
    if(jobDurationInMin <  60){
      return jobDurationInMin+" Minutes"
    }
    else{
      if(jobDurationInMin % 60 == 0){
        return (jobDurationInMin / 60) + " Hours";
      }
      else{
        return (jobDurationInMin / 60) +" Hours "+ (jobDurationInMin % 60 == 0) + " Minutes"
      }
     
    }
  }
  ngOnInit() {
  }
}
