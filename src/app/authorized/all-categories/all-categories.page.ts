import { Injectable, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//import { HomeService } from './home.service';
import { FileService } from '../db_services/file.service';
import { async } from 'rxjs';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { log } from 'console';
import { ProfileService } from '../db_services/profile.service';
import { Icon } from 'ionicons/dist/types/components/icon/icon';
import { AllCategoriesService } from './all-categories.service';
import { DataProviderService } from 'src/app/core/data-provider.service';
import { ModalController } from '@ionic/angular';
import { SubCategoryPage } from '../sub-categories/sub-categories.page';

@Component({
  selector: 'app-all-categories',
  templateUrl: './all-categories.page.html',
  styleUrls: ['./all-categories.page.scss'],
})
export class AllCategoriesPage implements OnInit {
  @ViewChild('search') input: any;
  isMobileview: boolean = false;
  isDesktopview: boolean = false;
  searchedIndex: number = 0;
  constructor(
    private router: Router,
    private profileService: ProfileService,
    private imageService: FileService,
    private http: HttpClient,
    private dataProvider: DataProviderService,
    public viewController: ModalController,
    private modalController: ModalController
  ) {
    setInterval(() => {
      if (this.searchedIndex + 1 < this.categories.length) this.searchedIndex++;
      else this.searchedIndex = 0;
    }, 2500);
  }

  ionViewDidEnter() {
    this.categories = [];
    this.systeminfo();
    this.dataProvider.mainCategories.subscribe((categories) => {
      this.categories = categories;
    });
  }

  systeminfo() {
    if (this.dataProvider.deviceInfo.deviceType === 'desktop') {
      this.isDesktopview = true;
      this.isMobileview = false;
    }
    if (this.dataProvider.deviceInfo.deviceType === 'mobile') {
      this.isDesktopview = false;
      this.isMobileview = true;
    }
  }

  async showSubCategories(id: any) {
    this.router.navigate([`/authorized/sub-Categories/${id}`]);
  }

  ionViewDidLeave() {
    // this.categories = [];
    this.isDesktopview = false;
  }

  back() {
    this.viewController.dismiss();
  }

  categories: any[] = []; // added by ronak
  icon: any[] = [];

  ngOnInit() {
    // this.fetchMainCategory();
    // this.fetchMainCategoryIcon();
  }

  home() {
    this.router.navigate(['home']);
  }
  cart() {
    this.router.navigate(['cart']);
  }

  booking() {
    this.router.navigate(['booking']);
  }

  AllCategories = [
    {
      label: 'Appliance Repair',
      img: '/assets/Ellipse 208.png',
    },
    {
      label: 'Bathroom Cleaning',
      img: '/assets/Group 34260.png',
    },
    {
      label: 'Kitchen Cleaning',
      img: '/assets/Group 34261.png',
    },
    {
      label: 'Full Home Cleaning',
      img: '/assets/Group 34260 (1).png',
    },
    {
      label: 'Sofa carpet Cleaning',
      img: '/assets/Group 34260 (2).png',
    },
    {
      label: 'Women Spa & Salon',
      img: '/assets/Group 34260 (3).png',
    },
    {
      label: 'Car Cleaning',
      img: '/assets/Group 34260 (4).png',
    },

    {
      label: 'Water Tank Cleaning',
      img: '/assets/Group 34260 (5).png',
    },
  ];
  // fetchMainCategory() {
  //   this.allCategoriesService.getCategory().then((name) => {
  //     this.categories = name.docs.map((doc) => {
  //       this.categories = [...this.categories];
  //       return doc.data()
  //     });
  //   })
  // }
  // fetchMainCategoryIcon() {
  //   this.allCategoriesService.getCategory().then((icon) => {
  //     this.icon = icon.docs.map((doc) => {
  //       this.icon = [...this.icon];
  //       return doc.data()

  //     });
  //   })
  // }
}
