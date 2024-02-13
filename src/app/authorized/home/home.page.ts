import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from './home.service';
import { FileService } from '../db_services/file.service';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { HttpClient } from '@angular/common/http';
import { ProfileService } from '../db_services/profile.service';
import { DataProviderService } from 'src/app/core/data-provider.service';
import { BookingService } from '../booking/booking.service';
import { LoadingController } from '@ionic/angular';
import Utils from '../common/util';
import Swiper from 'swiper';
import * as moment from 'moment';
import { UserNotificationService } from '../common/user-notification.service';
import { AddressService } from '../db_services/address.service';
import { Address } from '../select-address/address.structure';
import { CartService } from '../cart/cart.service';
import { NavigationBackService } from 'src/app/navigation-back.service';
import { DeviceDetectorService } from 'ngx-device-detector';
const CASHE_FOLDER = 'CASHED_IMG';

interface bannerConfig {
  image: string;
  url: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('content', { static: true }) content: any;
  @ViewChild('swiperContainer') swiperContainer!: ElementRef;
  @ViewChild('swiperContainer1') swiperContainer1!: ElementRef;
  @ViewChild('swiperContainer2') swiperContainer2!: ElementRef;
  todayDate: number = Date.now();
  isNotServiceableModalOpen: boolean = false;
  utils: any;

  banners: any[] = [];
  recentActivityData: any[] = [];
  categories: any[] = []; // added by ronak
  icon: any[] = []; // added by ronak
  swiper!: Swiper;
  swiper1!: Swiper;
  swiper2!: Swiper;
  upcomingBookings: any[] = [];
  notifications: any[] = [];
  unreadNotifications: any[] = [];
  addresses: Address[] = [];
  currentAddress: Address | undefined;
  bannerObject = {
    showBanner: false,
    showMiddle: false,
    showTop: false,
  };
  topBanner: any[] = [];
  middleBanner: any[] = [];
  deviceInfo: any;
  constructor(
    private addressService: AddressService,
    private router: Router,
    private profileService: ProfileService,
    private dataProvider: DataProviderService,
    public homeService: HomeService,
    private imageService: FileService,
    private http: HttpClient,
    public bookingService: BookingService,
    private loadingController: LoadingController,
    private _notificationService: UserNotificationService,
    public _cartService: CartService,
    private _navigationService: NavigationBackService,
    private deviceService: DeviceDetectorService
  ) {
    this._notificationService
      .getCurrentUserNotification()
      .then((notificationRequest) => {
        this.notifications = notificationRequest.docs.map(
          (notification: any) => {
            return { ...notification.data(), id: notification.id };
          }
        );
        this.homeService.showMobileBanner().then((show) => {
          this.bannerObject.showBanner = show.data()?.['show'];
          if (this.bannerObject.showBanner) {
            this.homeService.showMobileTop().then((top) => {
              this.bannerObject.showTop = top.data()?.['show'];
              if (this.bannerObject.showTop) {
                this.homeService.getTopBanner().then((topBan) => {
                  this.topBanner = topBan.docs
                    .map((item) => {
                      return { ...item.data(), id: item.id };
                    })
                    .filter((item) => item?.['show']);
                  if (this.topBanner.length > 0) {
                    if (this.swiper2) {
                      this.swiper2.destroy();
                    }
                    this.swiper2 = new Swiper(
                      this.swiperContainer2.nativeElement,
                      {
                        slidesPerView: 1,
                        spaceBetween: 20,
                        pagination: {
                          el: '.swiper-pagination2',
                          clickable: true,
                        },
                        centeredSlides: true,
                        autoplay: {
                          delay: 2000,
                        },
                      }
                    );
                  }
                });
              }
            });
            this.homeService.showMobileMiddle().then((middle) => {
              this.bannerObject.showMiddle = middle.data()?.['show'];
              if (this.bannerObject.showMiddle) {
                this.homeService.getMiddleBanner().then((middleBan) => {
                  this.middleBanner = middleBan.docs
                    .map((item) => {
                      return { ...item.data(), id: item.id };
                    })
                    .filter((item) => item?.['show']);
                  if (this.middleBanner.length > 0) {
                    if (this.swiper) {
                      this.swiper.destroy();
                    }
                    this.swiper = new Swiper(
                      this.swiperContainer.nativeElement,
                      {
                        slidesPerView: 1,
                        spaceBetween: 20,
                        pagination: {
                          el: '.swiper-pagination',
                          clickable: true,
                        },
                        centeredSlides: true,
                        autoplay: {
                          delay: 2000,
                        },
                      }
                    );
                  }
                });
              }
            });
          }
        });
        this.unreadNotifications = this.notifications.filter(
          (notification: any) => {
            return !notification.read;
          }
        );
        this._notificationService.allNotifications.next(this.notifications);
        this._notificationService.unreadNotifications =
          this.unreadNotifications;
      });
    this.utils = Utils.stageMaster;
    this._cartService.getFixedCharges().then((fixedCharges) => {
      const cartFixedCharges = fixedCharges.docs.map((discount: any) => {
        return { ...discount.data(), id: discount.id };
      });
      this._cartService.fixedCharges = cartFixedCharges;
    });
    this.epicFunction();
  }

  epicFunction() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();
    isMobile && console.log('Mobile Screen');
    isTablet && console.log('Tablet Screen');
    isDesktopDevice && console.log('Desktop Screen');
  }

  async ngOnInit() {
    this._navigationService.isAddressSubscription$ = true;
    this.recentActivity();
    this.fetchMainCategoryIcon(); // added by ronak
    this.dataProvider.mainCategories.subscribe((categories) => {
      this.categories = categories;
      if (this.dataProvider.mainCategoriesLoaded) {
        setTimeout(() => {
          this.dataProvider.isPageLoaded$.next('loaded');
        }, 1000);
      }
    });
    this.fetchAddress();
    this.bookingService.bookingsSubject.subscribe((bookings) => {
      this.upcomingBookings = bookings.filter((item) => {
        if (
          item.stage == 'expired' ||
          item.stage == 'completed' ||
          item.stage == 'discarded' ||
          item.stage == 'cancelled'
        ) {
          return false;
        } else {
          return true;
        }
      });
      if (this.upcomingBookings.length > 0) {
        if (this.swiper1) {
          this.swiper1.destroy();
        }
        this.swiper1 = new Swiper(this.swiperContainer1.nativeElement, {
          slidesPerView: 1,
          spaceBetween: 20,
          pagination: {
            el: '.swiper-pagination1',
            clickable: true,
          },
          centeredSlides: true,
          autoplay: {
            delay: 2000,
          },
        });
      }
    });
  }

  scrollToTop() {
    if (this.content && this.content.scrollToTop) {
      this.content.scrollToTop();
    }
  }

  fetchAddress() {
    this.addresses = this.addressService.addresses;
    this.dataProvider.selectedAddress.next(this.addresses);
    this.addressService.fetchedAddresses.subscribe(
      async (address: Address[]) => {
        if (!this._navigationService.isAddressSubscription$) {
          return;
        }
        this.addresses = address;
        this.addressService.addresses = this.addresses;
        this.dataProvider.selectedAddress.next(this.addresses);
        let currentAddressTemp: any = this.addresses.find(
          (addre) => addre.isDefault
        );
        if (address.length > 0) {
          if (this.currentAddress?.id != currentAddressTemp.id) {
            this.currentAddress = currentAddressTemp;
            this._cartService.selectedCatalogue = '';
            this.setupCategories();
          }
        }
      }
    );
  }

  async setupCategories() {
    if (this.currentAddress) {
      const areas: any[] = (
        await this.addressService.getAreaForCatalogue(
          this.currentAddress.stateId,
          this.currentAddress.cityId
        )
      ).docs
        .map((area: any) => {
          return { ...area.data(), id: area.id };
        })
        .filter(
          (area) =>
            area['geoProofingLocality'] ===
              this.currentAddress?.geoProofingLocality && area.serviceCatalogue
        );
      if (areas.length > 0) {
        this.homeService.fetchData(areas[0].serviceCatalogue);
      } else {
        this.isNotServiceableModalOpen = true;
        this.dataProvider.mainCategoriesLoaded = true;
        this.homeService.mainCategories.next([]);
        setTimeout(() => {
          this.dataProvider.isPageLoaded$.next('loaded');
        }, 1000);
      }
    }
    this._cartService.selectedCatalogue =
      this.addresses[0].selectedArea.serviceCatalogue;
  }

  ionViewDidEnter() {
    this.scrollToTop();
    this._notificationService
      .getCurrentUserNotification()
      .then((notificationRequest) => {
        this.notifications = notificationRequest.docs.map(
          (notification: any) => {
            return { ...notification.data(), id: notification.id };
          }
        );
        this.unreadNotifications = this.notifications.filter(
          (notification: any) => {
            return !notification.read;
          }
        );
      });
  }

  ionViewDidLeave() {}

  ngAfterViewInit() {}
  ngOnDestroy() {}

  isFutureDate(date: Date | undefined) {
    if (!date) return false;
    // return true if date is of tomorrow or later
    let maxTimeToday = new Date();
    maxTimeToday.setHours(23, 59, 59, 999);
    return date > maxTimeToday;
  }

  fetchMainCategoryIcon() {
    this.homeService.getCategory().then((icon) => {
      this.icon = icon.docs.map((doc) => {
        this.icon = [...this.icon];
        return doc.data();
      });
    });
  }
  // till here

  cart() {
    this.router.navigate(['cart']);
  }

  booking() {
    this.router.navigate(['booking']);
  }

  home() {
    this.router.navigate(['home']);
  }
  notification() {
    this.router.navigate(['notification']);
  }

  async recentActivity() {
    await this.homeService.getRecentBookings().then((activity) => {
      this.recentActivityData = activity.docs.map((doc) => {
        return doc.data();
      });
    });
  }

  condition: boolean = true;
  prevText: string = '';
  // programmingLanguages: any[] = ['java', 'c++',
  //     'python', 'c', 'javascript'];
  res_list = [];
  res_cnt: number = 0;
  public searchInput!: any;
  public programmingLanguages: Array<any> = [
    'Python',
    'TypeScript',
    'C',
    'C++',
    'Java',
    'Go',
    'JavaScript',
    'PHP',
    'Ruby',
    'Swift',
    'Kotlin',
  ];
  Cleaning = [
    {
      label: 'Kitchen Cleaning',
      img: '/assets/Mask Group.png',
    },
    {
      label: 'Deep House Clean',
      img: '/assets/Mask Group (1).png',
    },
    {
      label: 'Deep House Clean',
      img: '/assets/Mask Group.png',
    },
  ];
  ACRepair = [
    {
      label: 'AC Deep Cleaning',
      img: '/assets/Group 34037.png',
    },
    {
      img: '/assets/Mask Group (2).png',
      label: 'Noise/Smell Issues',
    },
    {
      label: 'Noise/Smell Issues',
      img: '/assets/Group 34037.png',
    },
  ];
  BathroomCleanings = [
    {
      label: 'Monthly Cleaning',
      img: '/assets/Group 34037 (1).png',
    },
    {
      label: 'Quarterly Cleaning',
      img: '/assets/Mask Group (3).png',
    },
    {
      label: 'Quarterly Cleaning',
      img: '/assets/Mask Group (3).png',
    },
  ];

  onSubmit($event: KeyboardEvent) {
    if ($event.keyCode === 13) {
      this.condition = !this.condition;
      this.prevText = this.searchInput;
      this.res_cnt = 0;
      this.res_list = [];
      // setTimeout(() => {
      //     this.condition = false;
      //     for (let i = 0; i < this.programmingLanguages.length; i++) {
      //         if (this.programmingLanguages[i] === this.prevText.toLowerCase()
      //             || this.programmingLanguages[i].startsWith(this.prevText)) {
      //             this.res_cnt += 1;
      //             // this.res_list.push(this.programmingLanguages[i]);
      //         }
      //     }
      // }, 3000);
      this.searchInput = null;
    }
  }

  getImage(url: string) {
    let imageName = url.split('/').pop();
    if (imageName?.includes('?')) {
      imageName = imageName.split('?')[0];
      imageName = imageName.replaceAll('%2', '');
    }
    let fileType = url.split('.').pop();
    if (fileType?.includes('?')) {
      fileType = fileType.split('?')[0];
    }
    Filesystem.readFile({
      directory: Directory.Cache,
      path: `${CASHE_FOLDER}/${imageName}`,
    })
      .then(async (readFile) => {
        if (readFile.data === '') {
          let file = await this.saveImage(url, imageName);
          return `data:image/${fileType};base64,${file}`;
        } else return `data:image/${fileType};base64,${readFile.data}`;
      })
      .catch(async (e) => {
        let file = await this.saveImage(url, imageName);
        Filesystem.readFile({
          directory: Directory.Cache,
          path: `${CASHE_FOLDER}/${imageName}`,
        }).then((readFile) => {
          return `data:image/${fileType};base64,${readFile.data}`;
        });
      })
      .finally(() => {});
  }

  async saveImage(url: string, path) {
    const response: any = await fetch(url, {
      headers: new Headers({
        Origin: location.origin,
      }),
      mode: 'no-cors',
    })
      .then((response) => {})
      .catch((error) => {
        console.log('errror.....', error);
      });
    let blob = await response.body?.blob();
    const convertBlobToBase64 = (blob: Blob) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(blob);
      });
    const base64Data = (await convertBlobToBase64(blob)) as string;

    const savedFile = await Filesystem.writeFile({
      path: `${CASHE_FOLDER}/${path}`,
      data: base64Data,
      directory: Directory.Cache,
    });
    return savedFile;
  }

  onNotServiceableDismiss(event) {}

  onGotItClick() {
    this.isNotServiceableModalOpen = false;
    setTimeout(() => {
      this.router.navigate(['/authorized/select-address']);
    }, 100);
  }

  tConvert(time) {
    return moment(time, 'HH:mm').format('hh:mm a');
  }
}

export interface Banner {
  id?: string | null | undefined;
  title: string | null | undefined;
  bannerUrl: string | null | undefined;
  start: string | null | undefined;
  end: string | null | undefined;
  img: string;
  bannerNo?: number | null | undefined;
}
