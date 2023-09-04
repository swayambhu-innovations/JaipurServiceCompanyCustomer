import { Component, OnInit } from '@angular/core';
import { DataProviderService } from '../data-provider.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Category, Service, SubCategory } from '../home/home.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-services',
  templateUrl: './services.page.html',
  styleUrls: ['./services.page.scss'],
})
export class ServicesPage implements OnInit {
  services:Service[]=[];
  matchingSubCategory:SubCategory|undefined;
  matchingMainCategory:Category|undefined;
  constructor(private dataProvider:DataProviderService,private activatedRoute:ActivatedRoute,private router:Router) {
    this.activatedRoute.params.subscribe(async (params)=>{
      let mainCategories = await firstValueFrom(this.dataProvider.mainCategories);
      this.matchingMainCategory = mainCategories.find((mainCategory)=>mainCategory.id==params['mainCategoryId'])
      if(!this.matchingMainCategory){
        this.router.navigate(['/home']);
        return;
      }
      this.matchingSubCategory = this.matchingMainCategory.subCategories.find((subCategory)=>subCategory.id==params['subCategoryId'])
      if(!this.matchingSubCategory){
        this.router.navigate(['/home']);
        return;
      }
      this.services = this.matchingSubCategory.services;
    })
  }

  ngOnInit() {
  }

}
