import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataProviderService } from '../../core/data-provider.service';
import { firstValueFrom } from 'rxjs';
import { PaymentService } from '../../payment.service';
import * as $ from 'jquery';
@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.page.html',
  styleUrls: ['./service-detail.page.scss'],
})
export class ServiceDetailPage implements OnInit {
   modal: any;
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
  serviceType:Array<string> = [
    "Complete Kitchen",
    "Complete Kitchen With Chimney",
    "Complete Kitchen With Appliance",
    "Complete Kitchen With Appliance & Chimney"
  ]
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
  constructor(public dataProvider:DataProviderService,private activatedRoute:ActivatedRoute,private router:Router,
    private paymentService:PaymentService, public cartService:CartService, private loadingController: LoadingController
    , private activeRoute:ActivatedRoute) {
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
    });
   
  }
 async ngOnInit() {
    this.cartService.cartSubject.subscribe(cartDetils=>{
      this.cartDetils = cartDetils;
    })
    // if(this.dataProvider.currentUser?.user.uid){
    //   this.cartDetils =  await this.cartService.getCart(this.dataProvider.currentUser?.user.uid)
    //   console.log(" this.cartDetils: ", this.cartDetils)
    // }
    if(this.router.url.includes("service-detail")){
      console.log("this.router.url..:",this.router.url)
      $("#modal").show();
    }
    if(this.modal){
      this.modal.expand();
    }
  }
  showMode(modal:any){
    this.modal.expand();
    modal.setCurrentBreakpoint(0.12);
  }
  showAllVariants(modal:any){
    modal.setCurrentBreakpoint(0.75);
    this.isAddToCart = true;
  }
  ViewCart(modal:any){
    this.modal = modal;
    $("#modal").hide();
    modal.setCurrentBreakpoint(0.1);
    this.router.navigate(['/authorized/cart/all/all']);
  }

  async bookNow(variantId:string){
    let loader = await this.loadingController.create({message:'Please wait...'});
    await loader.present();
    let variant = this.matchingService?.variants.find(v=>v.id == variantId);
    this.paymentService.handlePayment({
      grandTotal: variant?.price || 0,
      user: {
        displayName: "Kumar Saptam",
        email: "saptampro2003@gmail.com",
        phone:'9026296062'
      }
    }).subscribe(async (paymentResponse)=>{
      if (JSON.parse(paymentResponse['body']).status=='captured'){
        await loader.dismiss();
      }
    },(error)=>{},async ()=>{
      await loader.dismiss();
    })
  }

  addToCart(variant:any){
    $("#input"+variant.id).val(1);
    let html =  document.getElementById(variant.id+"");
   $("."+variant.id).hide();
    html?.style.setProperty("display","block");
    this.totalPrice  += variant.price;
    this.selectedItems +=1;
    this.itemList.push(variant);
    this.cartService.addToCart(this.dataProvider.currentUser!.user.uid,variant.id,this.matchingService!,this.matchingMainCategory!,this.matchingSubCategory!);
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
  