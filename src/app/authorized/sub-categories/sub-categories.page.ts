import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataProviderService } from 'src/app/core/data-provider.service';
import { Category, SubCategory } from 'src/app/core/types/category.structure';
import { firstValueFrom } from 'rxjs';
import { IonModal, ModalController, Platform } from '@ionic/angular';
import { ServicesPage } from '../services/services.page';

@Component({
  selector: 'app-sub-categories',
  templateUrl: './sub-categories.page.html',
  styleUrls: ['./sub-categories.page.scss'],
})
export class SubCategoryPage implements OnInit {
  @Input('categoryId') categoryId;
  matchingMainCategory: Category | undefined;
  subCategory: SubCategory[] = [];
  mainCategoryId = '';
  mainCategories: any;
  title: string;

  deviceInfo: any;
  isModalOpen: boolean = false;
  mobileView: boolean = false;
  @ViewChild(IonModal) modal: IonModal;

  constructor(
    private dataProvider: DataProviderService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public platform: Platform,
    private viewController: ModalController,
    private modalController: ModalController
  ) {}
  async ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.mainCategoryId = params['mainCategoryId'];
    });

    this.matchingMainCategory = (
      await firstValueFrom(this.dataProvider.mainCategories)
    ).find((mainCategory) => mainCategory.id == this.mainCategoryId);

    if (this.matchingMainCategory === undefined) {
      this.router.navigate(['/home']);
      return;
    }
    this.subCategory = this.matchingMainCategory.subCategories;
    this.title = this.matchingMainCategory?.name + ' Sub Categories';
  }

  ionViewDidEnter() {
    this.systeminfo();
    console.log(this.dataProvider.deviceInfo);
  }

  ionViewDidLeave() {
    this.isModalOpen = false;
  }

  systeminfo() {
    if (this.dataProvider.deviceInfo.deviceType === 'desktop') {
      this.isModalOpen = true;
      this.mobileView = false;
    }
    if (this.dataProvider.deviceInfo.deviceType === 'mobile') {
      this.isModalOpen = false;
      this.mobileView = true;
    }
  }

  async subCategoryFun(categoryId, itemsId) {
    this.router.navigate([`/authorized/services/${categoryId}/${itemsId}`]);
  }
}
