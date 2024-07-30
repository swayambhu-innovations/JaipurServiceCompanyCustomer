import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataProviderService } from '../../core/data-provider.service';
import { firstValueFrom } from 'rxjs';
import { PaymentService } from '../../payment.service';
import * as $ from 'jquery';
import Swiper from 'swiper';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.page.html',
  styleUrls: ['./service-detail.page.scss'],
})
export class ServiceDetailPage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('videoContainer', { static: false, read: ElementRef })
  videoElement: ElementRef;
  @ViewChild('swiperContainerServiceDetail')
  swiperContainerServiceDetail!: ElementRef;
  @ViewChild('modal3') modal;
  particularBooking: any;
  @Input('serviceDetail') serviceDetail;
  matchingService: Service | any;
  matchingSubCategory: SubCategory | any;
  matchingMainCategory: Category | any;
  startPrice: number = 0;
  isAddToCart: boolean = false;
  selectedItems: number = 0;
  totalPrice: any = 0;
  showVariant: boolean = true;
  presentingElement;
  itemList: any = [];
  cartDetils: any;
  tags: any;
  mobileView: boolean = false;
  isModalOpen: boolean = false;
  showmodal: boolean = false;
  backdropValue: any = 0.1;
  swiper!: Swiper;
  mainCategories: any;
  title: string;
  CustomerReview = {
    userCount: 80,
    average: '4/5',
    userList: [
      {
        Name: 'Vikas Rajput',
        review: 'Excellent Service',
        date: '12 Jan, 2023',
        Comment:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Excellent service 👍',
      },
      {
        Name: 'Vikas Rajput',
        review: 'Excellent Service',
        date: '12 Jan, 2023',
        Comment:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Excellent service 👍',
      },
      {
        Name: 'Vikas Rajput',
        review: 'Excellent Service',
        date: '12 Jan, 2023',
        Comment: '4517 Washington Ave. Manchester, Kentucky 39495',
      },
    ],
  };
  isCategoryItemsLoaded: boolean = false;
  constructor(
    public dataProvider: DataProviderService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    public cartService: CartService,
    private loadingController: LoadingController,
    private activeRoute: ActivatedRoute,
    private viewController: ModalController,
    private toastController: ToastController
  ) {}

  async ngOnInit() {}

  ngAfterViewInit() {}

  ngOnDestroy() {
    if (this.swiper) {
      this.swiper.destroy();
    }
  }

  showAllVariants(modal: any) {
    modal.setCurrentBreakpoint(0.5);
    this.showmodal = true;
    this.isAddToCart = false;
    this.modal = modal;
  }

  ionBreakpointDidChange(event) {
    this.isAddToCart = !this.isAddToCart;
  }

  ViewCart() {
    this.router.navigate(['/authorized/cart/all/all']);
  }

  ionViewWillLeave() {
    this.isAddToCart = false;
    this.showmodal = false;
  }

  async ionViewWillEnter() {
    await (async () => {
      this.mainCategories = await firstValueFrom(
        this.dataProvider.mainCategories
      );
    })();

    this.activatedRoute.params.subscribe(async (params) => {
      this.matchingMainCategory = params['mainCategoryId'];
      this.matchingSubCategory = params['subCategoryId'];
      this.matchingService = params['serviceId'];
    });

    this.matchingMainCategory = this.mainCategories.find(
      (mainCategory) => mainCategory.id == this.matchingMainCategory
    );
    if (!this.matchingMainCategory) {
      this.router.navigate(['/home']);
      return;
    }
    this.matchingSubCategory = this.matchingMainCategory.subCategories.find(
      (subCategory) => subCategory.id == this.matchingSubCategory
    );
    if (!this.matchingSubCategory) {
      this.router.navigate(['/home']);
      return;
    }
    this.matchingService = this.matchingSubCategory.services.find(
      (service) => service.id == this.matchingService
    );
    if (
      this.matchingService?.variants &&
      this.matchingService?.variants.length > 0
    ) {
      this.startPrice = this.matchingService?.variants[0].price;
    }
    this.isCategoryItemsLoaded = true;
    this.title = this.matchingService?.name;
  }

  ionViewDidEnter() {
    this.systeminfo();
    this.cartDetils = this.cartService.cart;
    this.cartService.cartSubject.subscribe((cartDetils) => {
      this.cartDetils = cartDetils;
    });

    if (this.videoElement?.nativeElement) {
      this.videoElement.nativeElement.muted = true;
    }
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

  back() {
    this.viewController.dismiss();
  }

  ionBackdropTap(modal) {
    modal.setCurrentBreakpoint(0.1);
  }

  async bookNow(
    matchingMainCategoryId: string,
    matchingServiceId: string,
    variantId: string
  ) {
    let loader = await this.loadingController.create({
      message: 'Please wait...',
    });
    loader.present();
    let variant = this.matchingService?.variants.find((v) => v.id == variantId);
    if (this.dataProvider.currentUser)
      await this.cartService.addToCart(
        this.dataProvider.currentUser!.user.uid,
        variantId,
        this.matchingService!,
        this.matchingMainCategory!,
        this.matchingSubCategory!
      );
    else
      await this.cartService.addToCartAuthLess(
        variantId,
        this.matchingService!,
        this.matchingMainCategory!,
        this.matchingSubCategory!
      );
    loader.dismiss();
    this.cartService.cartSubject.subscribe((cartDetils) => {
      this.cartDetils = cartDetils;
    });
    this.router.navigate([
      `/authorized/cart/${matchingMainCategoryId}/${matchingServiceId}`,
    ]);
  }

  ionViewDidLeave() {
    this.isModalOpen = false;
  }

  cart: any[] = [];

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
    });
    toast.present();
  }

  async addToCart(variant: any) {
    $('#input' + variant.id).val(1);
    let html = document.getElementById(variant.id + '');
    $('.' + variant.id).hide();
    html?.style.setProperty('display', 'flex');
    this.totalPrice += variant.price;
    this.selectedItems += 1;
    this.itemList.push(variant);
    if (this.dataProvider.currentUser)
      await this.cartService.addToCart(
        this.dataProvider.currentUser!.user.uid,
        variant.id,
        this.matchingService!,
        this.matchingMainCategory!,
        this.matchingSubCategory!
      );
    else
      await this.cartService.addToCartAuthLess(
        variant.id,
        this.matchingService!,
        this.matchingMainCategory!,
        this.matchingSubCategory!
      );
  }

  decrementQuantity(
    matchingCategoryId,
    matchingSubCategoryId,
    matchingService,
    variantId
  ) {
    const bookingId = this.getBookingId(
      matchingCategoryId,
      matchingSubCategoryId,
      matchingService
    );
    if (this.dataProvider.currentUser)
      this.cartService.decrementQuantity(
        this.dataProvider.currentUser!.user.uid,
        matchingService!,
        variantId,
        bookingId
      );
    else
      this.cartService.decrementQuantityAuthLess(
        matchingService!,
        variantId,
        bookingId
      );
  }

  incrementQuantity(
    matchingCategoryId,
    matchingSubCategoryId,
    matchingService,
    variantId
  ) {
    const bookingId = this.getBookingId(
      matchingCategoryId,
      matchingSubCategoryId,
      matchingService
    );
    if (this.dataProvider.currentUser)
      this.cartService.incrementQuantity(
        this.dataProvider.currentUser!.user.uid,
        matchingService!,
        variantId,
        bookingId
      );
    else
      this.cartService.incrementQuantityAuthLess(
        matchingService!,
        variantId,
        bookingId
      );
  }

  removeFromCart(
    matchingCategoryId,
    matchingSubCategoryId,
    matchingService,
    variantId
  ) {
    const bookingId = this.getBookingId(
      matchingCategoryId,
      matchingSubCategoryId,
      matchingService
    );
    if (this.dataProvider.currentUser)
      this.cartService.removeFromCart(
        this.dataProvider.currentUser!.user.uid,
        matchingService!.id,
        variantId,
        bookingId
      );
    else
      this.cartService.removeFromCart(
        '',
        matchingService!.id,
        variantId,
        bookingId
      );
  }

  getBookingId(matchingCategoryId, matchingSubCategoryId, matchingService) {
    let bookingId = '';
    this.cartDetils.map((booking) => {
      if (
        booking.mainCategory.id == matchingCategoryId &&
        booking.subCategory.id == matchingSubCategoryId
      ) {
        // this.particularBooking = booking;
        const service = booking.services.map((services) => {
          return matchingService.id == services.serviceId;
        });
        if (service) {
          bookingId = booking.id;
        }
      }
    });
    return bookingId;
  }
}

// create a filter pipe which removes extra <br> from the text
import { Pipe, PipeTransform } from '@angular/core';
import {
  Service,
  SubCategory,
  Category,
} from '../../core/types/category.structure';
import { CartService } from '../cart/cart.service';
import { LoadingController, ModalController } from '@ionic/angular';

@Pipe({
  name: 'removeExtraBr',
})
export class RemoveExtraBrPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return value.replace(/<br>/g, '');
  }
}
