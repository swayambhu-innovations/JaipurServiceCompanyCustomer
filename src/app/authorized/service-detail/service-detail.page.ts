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
  @ViewChild('#modal') modal: ElementRef;
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
  CustomerReview = [
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
  constructor(private dataProvider:DataProviderService,private activatedRoute:ActivatedRoute,private router:Router,private paymentService:PaymentService, public cartService:CartService, private loadingController: LoadingController) {
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

  ngOnInit() {
    this.presentingElement = document.querySelector('.ion-page');
    document?.querySelector('#modal')?.shadowRoot?.querySelector('.modal-wrapper')?.setAttribute('style', 'opacity:1');
  }

  showAllVariants(modal:any){
    modal.setCurrentBreakpoint(0.75);
    this.isAddToCart = true;
    // if(this.matchingService?.variants && this.matchingService?.variants.length){
    //   console.log("this.initialBreakpoint: ",this.initialBreakpoint,  this.presentingElement)
    //     this.presentingElement.setCurrentBreakpoint(0.7);
    //   this.showVariant = false;
    // }else{
    //   this.presentingElement.setCurrentBreakpoint(0.1);
    //   this.showVariant = true;
    //   alert("no variant found !");
    // }
    
  }
  ViewCart(){

  }
  moveTo(breakpoint: number) {
   
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
  addItem(variant:any){
    this.itemList.push(variant);
    this.totalPrice  += variant.price;
    this.selectedItems +=1;
    $("#input"+variant.id).val(parseInt($("#input"+variant.id).val())+1);
    $("#"+variant.id).find(".remove").prop("disabled",false);
  }
  removeItem(variant:any){
    if(this.totalPrice === 0)
    return;
  let this_ = this;
    let index = this.itemList.findIndex(function(i){
      if(i.id === variant.id){
        this_.totalPrice  -= variant.price;
        this_.selectedItems -=1;
        $("#input"+variant.id).val(parseInt($("#input"+variant.id).val())-1);
      }
      return i.id === variant.id;
  });
  
    if(index != -1){
      this.itemList.splice(index, 1);
    }else{
      $("."+variant.id).show();
      $("#"+variant.id).hide();
    }
    if(parseInt($("#input"+variant.id).val())=== 1){
      $("#"+variant.id).find(".remove").prop("disabled",true);
    }
  }
  removeAll(variant:any){
    this.itemList = this.itemList.filter(item=> {
      if(item.id === variant.id){
        this.totalPrice  -= item.price;
        this.selectedItems -=1;
        $("#input"+variant.id).val(parseInt($("#input"+variant.id).val())-1);
      }
      return !(item.id === variant.id);
    });
    $("."+variant.id).show();
    $("#"+variant.id).hide();
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
  