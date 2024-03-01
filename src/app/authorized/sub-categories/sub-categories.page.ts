import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataProviderService } from 'src/app/core/data-provider.service';
import { Category, SubCategory } from 'src/app/core/types/category.structure';
import { firstValueFrom } from 'rxjs';
import { IonModal, Platform } from '@ionic/angular';

@Component({
  selector: 'app-sub-categories',
  templateUrl: './sub-categories.page.html',
  styleUrls: ['./sub-categories.page.scss'],
})
export class SubCategoryPage implements OnInit {
  matchingMainCategory: Category | undefined;
  subCategory: SubCategory[] = [];
  mainCategoryId = "";


  deviceInfo:any
  isModalOpen:boolean = false;
  mobileView: boolean = true;
  @ViewChild(IonModal) modal: IonModal;

  constructor(
    private dataProvider: DataProviderService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public platform: Platform
  ) {
    this.activatedRoute.params.subscribe(async (params) => {
      let mainCategories = await firstValueFrom(
        this.dataProvider.mainCategories
      );
      this.mainCategoryId = params['mainCategoryId'];
      this.matchingMainCategory = mainCategories.find(
        (mainCategory) => mainCategory.id == params['mainCategoryId']
      );
      if (this.matchingMainCategory === undefined) {
        this.router.navigate(['/home']);
        return;
      }
      this.subCategory = this.matchingMainCategory.subCategories;
    });
  }
  
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
  
  ngOnInit(): void {
    
  }
}
