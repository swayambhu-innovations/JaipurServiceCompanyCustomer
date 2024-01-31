import { Time } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { SharedArrayService } from '../../shared-array.service';
import { Booking } from '../booking/booking.structure';
import { CartService } from './cart.service';
import { DataProviderService } from 'src/app/core/data-provider.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { OffersComponent } from './offers/offers.component';
import { Coupon } from 'src/app/coupons.structure';
// import { ActionSheetController } from '@ionic/angular';

interface Service {
  serviceName: string;
  serviceTime: Time;
  serviceRating: number;
  serviceTotalRatingCount: number;
  serviceOriginalPrice: number;
  serviceDiscountedPrice: number;
  serviceThumbnailPath: string;
  serviceOrderCount: number;
}
export class HomePage {}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  // action sheet buttons
  pageLeaved:boolean = false;
  recommendedServices :any[] = [];
  isModalOpen = true;
  isCouponActive:boolean =false;
  bookings:Booking[]=[];
  selectedBooking:Booking|undefined;
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
  selectedCoupan:Coupon;
  // coupons array
  isOpenPopu:boolean = false;
  discounts:any[] = [];
  fixedCharges:any = [];
  cart:any;
  cartLoaded:boolean = false;
  mainCategoryId:string = '';
  serviceId:string = '';
  isRecommended: boolean = false;
  couponCount:number = 0;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private activatedRoute:ActivatedRoute,
    public cartService:CartService,
    public dataProvider:DataProviderService,
    private modalController:ModalController,
    private loadingController: LoadingController
  ) {
    this.route.paramMap.subscribe( paramMap => {
      this.mainCategoryId = paramMap.get('mainCategoryId') ?? '';
      this.serviceId = paramMap.get('serviceId') ?? '';
    })
  }
 
  notification(){
    this.router.navigate(["authorized/notification"]);
  }

  temp(){
    this.dataProvider.selectedAddress.subscribe(address=>{
      
      if(address.length > 0){
        let currentAddress = address.filter(addre=> addre.isDefault);
        if(currentAddress.length > 0 ){
          this.dataProvider.currentBooking!.address=currentAddress[0];
        }else{
          this.dataProvider.currentBooking!.address=address[0];
        }
      }
      if(this.pageLeaved){
        return;
      }
      if(this.dataProvider.currentBooking!.address){
      this.router.navigate(["/authorized/select-slot"]);
      }else{
        this.router.navigate(["/authorized/select-address"]);
      }
    });
  }


  async onOffersClick(modal2:any) {
    let modal = await this.modalController.create({
      component:OffersComponent,
      componentProps:{
        booking:this.selectedBooking,
        applicableDiscounts: this.cartService.applicableDiscounts,
        subTotal: this.selectedBooking?.billing?.subTotal,
        appliedCoupon : this.selectedBooking!['appliedCoupon']
      }
    });
    modal.onDidDismiss()
      .then((data) => {
        const callbackData = data['data'];
        const coupan = callbackData['appliedCoupon'];
        const isRemoved = callbackData['isRemoved'];
        if(isRemoved && !coupan){
          this.removeCoupan(this.dataProvider.currentUser?.user!.uid!,this.selectedBooking?.id!);
        }
        else if(coupan){
          this.isOpenPopu = true;
          modal2.setCurrentBreakpoint(0.3);
          modal2.present();
          this.selectedCoupan = coupan;
          this.appliedCoupanDiscount();
        }
    });
    modal.present()
  }
  ionViewDidLeave(){
    // this.selectedBooking = undefined;
    this.pageLeaved = true;
    if(this.cart.length !== 1){
      this.selectedBooking = undefined;
    }
  }

  async ionViewDidEnter(){
    this.pageLeaved = false;
    if(this.cartService.cart.length === 1){
      this.selectedBooking = this.cartService.cart[0];
      this.createOfferCount();
      this.addFixedCharges();
    }else{
      this.selectedBooking = undefined;
    }
  }
  onRemoveCoupon(){
    this.removeCoupan(this.dataProvider.currentUser?.user!.uid!,this.selectedBooking?.id!);
  }

  removeCoupan(userId,bookingId){
    delete this.selectedBooking!['appliedCoupon'];
    this.cartService.calculateBilling(this.selectedBooking!);
    this.cartService.onRemoveCoupon(userId,bookingId,this.selectedBooking);
  }

  appliedCoupanDiscount(){
    //this.selectedBooking!['appliedCoupon'] = this.selectedCoupan;
    this.cartService.calculateBilling(this.selectedBooking!);
  }
  getOfferCount(){
    let count =0;
    this.selectedBooking?.services.forEach(services=>{
      services.discountsApplicable?.map((discount) => {
        if(this.selectedBooking?.billing?.subTotal){
          if(
            (discount.type == 'flat' && (discount?.value <= this.selectedBooking?.billing?.subTotal ?? 0)) ||
            (discount.type != 'flat') 
          ){
            count++;
          }
        }
      });
    });
    return count;
  }

  createOfferCount(){
    this.couponCount = 0;
    const discountList:any[] = [];
    this.selectedBooking?.services.forEach(services=>{
      services.discountsApplicable?.map((discount) => {
        if(this.selectedBooking?.billing?.subTotal){
          if(
            (discount.type == 'flat' && (discount?.value <= this.selectedBooking?.billing?.subTotal ?? 0)) ||
            (discount.type != 'flat') 
          ){
            const index = discountList.findIndex(item => item.id == discount.id);
            if(index < 0){
              discountList.push(discount);
            }
          }
        }
      });
    });
    this.couponCount = discountList.length;
  }
  services: Service[] = [];

  addTime(time1: {minutes:number}, time2: {minutes:number}): {minutes:number} {
    const result: {minutes:number} = {
      minutes: time1.minutes + time2.minutes,
    };
    if (result.minutes >= 60) {
      result.minutes %= 60;
    }
    return result;
  }
  
  onIncrementCartQuantity(service,variant){

    this.cartService.incrementFormQuantity(this.dataProvider.currentUser?.user!.uid!,service,variant.variantId,this.selectedBooking?.id!)
  }

  onDecrementCartQuantity(service,variant){
    this.cartService.decrementFormQuantity(this.dataProvider.currentUser?.user!.uid!,service,variant.variantId,this.selectedBooking?.id!);
    if(this.selectedBooking?.appliedCoupon?.minimumRequiredAmount && this.selectedBooking?.appliedCoupon?.minimumRequiredAmount > this.selectedBooking?.billing.subTotal){
      this.removeCoupan(this.dataProvider.currentUser?.user!.uid!,this.selectedBooking?.id!);
    }
  }

  onDeleteItemFromCart(service,variant){
    this.cartService.removeFromCart(this.dataProvider.currentUser!.user.uid,service!.serviceId,variant.variantId,this.selectedBooking?.id!);
    if(this.selectedBooking?.appliedCoupon?.minimumRequiredAmount && this.selectedBooking?.appliedCoupon?.minimumRequiredAmount > this.selectedBooking?.billing.subTotal){
      this.removeCoupan(this.dataProvider.currentUser?.user!.uid!,this.selectedBooking?.id!);
    }
  }

  get totalTimeNeeded() {
    let mins= 0;
     this.selectedBooking?.services.forEach(service=>{
        service.variants.forEach(variant=>{
          if(variant.actualJobDuration){
            mins += (variant.actualJobDuration * variant.quantity) ;
          }
        })
     });
     
    let duration =  mins + " Mins";
    // if(mins > 1){
    //   duration = mins + " Hours"
    // }
    // else{
    //   duration = mins + " Hour"
    // }
    return duration;
  }


  removeService(serviceToRemove: Service) {
    this.services = this.services.filter(
      (service) => service !== serviceToRemove
    );
  }

  increaseServiceCount(onService: Service) {
    onService.serviceOrderCount++;
  }
  deccreaseServiceCount(onService: Service) {
    onService.serviceOrderCount--;
  }
  orderCount: any = 2;
  async ngOnInit() {
    this.cart = this.cartService.cart;
    this.cartLoaded = true;
    if(this.cart.length > 0){
      this.setCurrentBooking();
    }
    this.cartService.cartSubject.subscribe((bookings)=>{
      this.cart = bookings;

      if(this.mainCategoryId != 'all'){
        this.setCurrentBooking();
      }
      if (this.selectedBooking?.id && bookings.length > 0){
        let foundBooking = bookings.find((booking)=>booking.id===this.selectedBooking!.id);
        if (foundBooking){
          this.selectedBooking = foundBooking;
          this.createOfferCount();
        }else{
          this.selectedBooking = undefined;
        }
      }else{
        this.selectedBooking = undefined;
      }
      
    });
  }

  calculateTotal() {}
  checkout() {}
  removeFromCart(service: any) {}
  setCurrentBooking(){
    this.selectedBooking = this.cart.find((booking) => {
      const serviceFind = booking.services.find((service) => service.serviceId == this.serviceId);
      return serviceFind && booking.mainCategory.id == this.mainCategoryId
    });
    if(this.selectedBooking){
      this.createOfferCount();
      this.addFixedCharges();
    }
    
  }

  async onSelectBooking(booking){
    this.selectedBooking = booking;
    this.createOfferCount();
    this.recommendedServices = [];
    this.isRecommended = false;
    const servicesList = await this.cartService.getServices(this.cartService.selectedCatalogue, this.selectedBooking?.mainCategory.id ?? '', this.selectedBooking?.subCategory.id ?? '');
    servicesList.map((serviceItem) => {
      this.selectedBooking?.services.map((selectedService) => {
        if(selectedService.serviceId == serviceItem.id){
          serviceItem.services.map((recommended) => {
            this.recommendedServices.push(recommended);
          });
        }
      })
    });
    this.recommendedServices.map((item) => {
      if(item?.image[0]){
        this.isRecommended = true;
      }
    });
    if(this.selectedBooking){
      this.addFixedCharges();
    }
  }

  onClickRecommendedServices(service){
    this.router.navigate(['authorized','service-detail',this.selectedBooking?.mainCategory.id, this.selectedBooking?.subCategory.id,service.id]);
  }

  addFixedCharges(){
    if(this.selectedBooking){
      this.selectedBooking.billing['fixedCharges'] = this.cartService.fixedCharges;
      const finalAmount = this.selectedBooking.billing.subTotal - this.selectedBooking.billing.discount - ( this.selectedBooking.billing?.coupanDiscunt || 0);
      let fixedCharges = 0;
      this.cartService.fixedCharges.map((charge) => {
        if(this.selectedBooking){
          fixedCharges+= (+(charge.amount))
        }
      });
      this.selectedBooking.billing.grandTotal = finalAmount + fixedCharges;
    }
    
  }
  
}
  