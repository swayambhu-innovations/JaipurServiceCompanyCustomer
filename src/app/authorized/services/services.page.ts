import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DataProviderService } from '../../core/data-provider.service';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import {
  Service,
  SubCategory,
  Category,
} from '../../core/types/category.structure';
import { IonModal, ModalController } from '@ionic/angular';
import { ServiceDetailPage } from '../service-detail/service-detail.page';

@Component({
  selector: 'app-services',
  templateUrl: './services.page.html',
  styleUrls: ['./services.page.scss'],
})
export class ServicesPage implements OnInit {
  @Input('subCategoryId') subCategoryId;
  mainCategories: any;
  services: Service[] = [];
  mainCatId = '';
  subCatId = '';
  matchingSubCategory: SubCategory | undefined;
  matchingMainCategory: Category | undefined;

  //modal
  deviceInfo: any;
  isModalOpen: boolean = false;
  mobileView: boolean = false;
  @ViewChild(IonModal) modal: IonModal;

  constructor(
    private dataProvider: DataProviderService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private viewController: ModalController,
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    await (async () => {
      this.mainCategories = await firstValueFrom(
        this.dataProvider.mainCategories
      );
    })();

    this.activatedRoute.params.subscribe((params) => {
      this.mainCatId = params['mainCategoryId'];
      this.subCatId = params['subCategoryId'].trim();
    });

    this.matchingMainCategory = this.mainCategories.find(
      (mainCategory: { id: string }) => mainCategory.id == this.mainCatId
    );
    if (!this.matchingMainCategory) {
      this.router.navigate(['/authorized/home']);
      return;
    }
    this.matchingSubCategory = this.matchingMainCategory.subCategories.find(
      (subCategory) => {
        return subCategory.id == this.subCatId;
      }
    );
    if (!this.matchingSubCategory) {
      return;
    }

    const sortedSubCategory = this.matchingSubCategory.services.sort((a, b) => {
      return a.variants[0].price - b.variants[0].price;
    });
    this.services = sortedSubCategory;
  }

  getJobDuration(jobDurationInMin) {
    if (jobDurationInMin < 60) {
      return jobDurationInMin + ' Minutes';
    } else {
      if (jobDurationInMin % 60 == 0) {
        return jobDurationInMin / 60 + ' Hours';
      } else {
        return (
          Math.floor(jobDurationInMin / 60) +
          ' Hours ' +
          Math.floor(jobDurationInMin % 60) +
          ' Minutes'
        );
      }
    }
  }

  back() {
    this.viewController.dismiss();
  }

  //modal
  ionViewDidEnter() {
    this.systeminfo();
  }

  ionViewDidLeave() {
    this.isModalOpen = false;
  }

  systeminfo() {
    if (this.dataProvider.deviceInfo.deviceType === 'desktop') {
      this.isModalOpen = true;
      this.mobileView = false;
    } else if (this.dataProvider.deviceInfo.deviceType === 'mobile') {
      this.isModalOpen = false;
      this.mobileView = true;
    }
  }

  async openCartFunctionWithSubId(mainCatId, subCatId, resultId) {
    this.router.navigate([
      `/authorized/service-detail/${mainCatId}/${subCatId}/${resultId}`,
    ]);
  }
}
