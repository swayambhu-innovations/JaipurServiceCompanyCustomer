import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataProviderService } from '../../core/data-provider.service';
import { firstValueFrom } from 'rxjs';
import { PaymentService } from '../../payment.service';
import * as $ from 'jquery';
import Swiper from 'swiper';
@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.page.html',
  styleUrls: ['./service-detail.page.scss'],
})
export class ServiceDetailPage implements OnInit , AfterViewInit, OnDestroy {
  @ViewChild('videoContainer', { static: false, read: ElementRef }) videoElement:ElementRef;
  @ViewChild('swiperContainerServiceDetail') swiperContainerServiceDetail!: ElementRef;
  @ViewChild('modal3') modal;
  particularBooking:any;

  matchingService:Service|undefined;
  matchingSubCategory:SubCategory|undefined;
  matchingMainCategory:Category|undefined;
  startPrice:number = 0;
  isAddToCart:boolean =false;
  selectedItems:number = 0;
  totalPrice:any = 0;
  showVariant:boolean = true;
  presentingElement ;
  itemList:any = [];
  cartDetils:any;
  tags: any;
  showmodal: boolean = false;
  backdropValue: any = 0.1;
  swiper!: Swiper;
  CustomerReview ={
    userCount: 80,
    average:"4/5",
    userList:[
      {
        Name: "Vikas Rajput",
        review: "Excellent Service",
        date: "12 Jan, 2023",
        Comment: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Excellent service 👍"
      },
      {
        Name: "Vikas Rajput",
        review: "Excellent Service",
        date: "12 Jan, 2023",
        Comment: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Excellent service 👍"
      },
      {
        Name: "Vikas Rajput",
        review: "Excellent Service",
        date: "12 Jan, 2023",
        Comment: "4517 Washington Ave. Manchester, Kentucky 39495"
      },
    ]
  } 
  isCategoryItemsLoaded: boolean = false;
  constructor(public dataProvider:DataProviderService,private activatedRoute:ActivatedRoute,private router:Router,
    private paymentService:PaymentService, public cartService:CartService, private loadingController: LoadingController
    , private activeRoute:ActivatedRoute) {
    
   
  }

  async ngOnInit() {
    
  }


  ngAfterViewInit() {
    
  }

  ngOnDestroy() {
    if (this.swiper) {
      this.swiper.destroy();
    }
  }

  showAllVariants(modal:any){
    modal.setCurrentBreakpoint(0.5);
    this.showmodal = true;
    this.isAddToCart = false;
    this.modal = modal;
  }

  ionBreakpointDidChange(event){
    this.isAddToCart = !this.isAddToCart;
  }

  ViewCart(modal:any){
    //this.modal.setCurrentBreakpoint(0.3);
    this.router.navigate(['/authorized/cart/all/all']);
  }

  ionViewWillLeave() {
    this.isAddToCart = false;
    this.showmodal = false;
  }

  ionViewWillEnter(){
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
      
      this.matchingService = this.matchingSubCategory.services.find((service)=>service.id==params['serviceId']);
      if(this.matchingService?.variants && this.matchingService?.variants.length >0){
        this.startPrice = this.matchingService?.variants[0].price;
      }
      this.isCategoryItemsLoaded = true;
    });
  }

  ionViewDidEnter(){
    this.cartDetils = this.cartService.cart;
    this.cartService.cartSubject.subscribe(cartDetils=>{
      this.cartDetils = cartDetils;
    })
    //this.modal.present();

    this.swiper = new Swiper(this.swiperContainerServiceDetail.nativeElement, {
      slidesPerView: 1,
      spaceBetween: 20,
      pagination: {
        el: '.swiper-pagination-service-detail',
        clickable: true,
      },
      autoplay: {
        delay : 2000,
        disableOnInteraction: true
      },
      rewind : true
    });
    if(this.videoElement?.nativeElement){
      this.videoElement.nativeElement.muted = true;
    }
  }

  ionBackdropTap(modal){
    modal.setCurrentBreakpoint(0.1);
  }

  async bookNow(matchingMainCategoryId:string,matchingServiceId:string, variantId:string){
    let loader = await this.loadingController.create({message:'Please wait...'});
    loader.present();
    let variant = this.matchingService?.variants.find(v=>v.id == variantId);
    await this.cartService.addToCart(this.dataProvider.currentUser!.user.uid,variantId,this.matchingService!,this.matchingMainCategory!,this.matchingSubCategory!);
    loader.dismiss();
    this.cartService.cartSubject.subscribe(cartDetils=>{
      this.cartDetils = cartDetils;
    })
    this.router.navigate([`/authorized/cart/${matchingMainCategoryId}/${matchingServiceId}`]);
    
      // this.paymentService.handlePayment({
      //   grandTotal: variant?.price || 0,
      //   user: {
      //     displayName: "Kumar Saptam",
      //     email: "saptampro2003@gmail.com",
      //     phone:'9026296062'
      //   }
      // }).subscribe(async (paymentResponse)=>{
      //   if (JSON.parse(paymentResponse['body']).status=='captured'){
      //     await loader.dismiss();
      //   }
      // },(error)=>{},async ()=>{
      //   await loader.dismiss();
      // })
  }

  addToCart(variant:any){
    $("#input"+variant.id).val(1);
    let html =  document.getElementById(variant.id+"");
   $("."+variant.id).hide();
    html?.style.setProperty("display","flex");
    this.totalPrice  += variant.price;
    this.selectedItems +=1;
    this.itemList.push(variant);
    this.cartService.addToCart(this.dataProvider.currentUser!.user.uid,variant.id,this.matchingService!,this.matchingMainCategory!,this.matchingSubCategory!);
  }

  decrementQuantity(matchingCategoryId,matchingSubCategoryId,matchingService, variantId){
    const bookingId = this.getBookingId(matchingCategoryId,matchingSubCategoryId,matchingService);
    this.cartService.decrementQuantity(this.dataProvider.currentUser!.user.uid,matchingService!,variantId,bookingId);
  }

  incrementQuantity(matchingCategoryId,matchingSubCategoryId, matchingService, variantId){
    const bookingId = this.getBookingId(matchingCategoryId,matchingSubCategoryId,matchingService);
    this.cartService.incrementQuantity(this.dataProvider.currentUser!.user.uid,matchingService!,variantId,bookingId);
  }

  removeFromCart(matchingCategoryId,matchingSubCategoryId, matchingService, variantId){
    const bookingId = this.getBookingId(matchingCategoryId,matchingSubCategoryId,matchingService);
    this.cartService.removeFromCart(this.dataProvider.currentUser!.user.uid,matchingService!.id,variantId,bookingId);
  }

  getBookingId(matchingCategoryId,matchingSubCategoryId,matchingService){
    let bookingId = '';
    this.cartDetils.map((booking) => {
      if (booking.mainCategory.id == matchingCategoryId && booking.subCategory.id == matchingSubCategoryId){
        // this.particularBooking = booking;
        const service = booking.services.map((services) => {
          return matchingService.id == services.serviceId
        });
        if(service){
          bookingId = booking.id
        }
      }
    });
    return bookingId;
  }
 
}

// create a filter pipe which removes extra <br> from the text
import { Pipe, PipeTransform } from '@angular/core';
import { Service, SubCategory, Category } from '../../core/types/category.structure';
import { CartService } from '../cart/cart.service';
import { LoadingController } from '@ionic/angular';

@Pipe({
  name: 'removeExtraBr'
})
export class RemoveExtraBrPipe implements PipeTransform {
  
    transform(value: any, args?: any): any {
      return value.replace(/<br>/g, '');
    }
  
  }
  