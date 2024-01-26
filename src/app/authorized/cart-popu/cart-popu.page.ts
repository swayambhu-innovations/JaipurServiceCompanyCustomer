import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataProviderService } from '../../core/data-provider.service';
import { PaymentService } from '../../payment.service';
import * as $ from 'jquery';
import { CartService } from '../cart/cart.service';
import { ModalController } from '@ionic/angular';
import { Category, Service, SubCategory } from 'src/app/core/types/category.structure';
export class HomePage {}

@Component({
  selector: 'app-cart-popu',
  templateUrl: './cart-popu.page.html',
  styleUrls: ['./cart-popu.page.scss'],
})
export class CartPopuPage implements OnInit {
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
  showModal:boolean = true;
  itemList:any = [];
  cartDetils:any;
  setOpen(isOpen: boolean) {
    this.showModal = isOpen;
  }
  constructor(
    private router: Router,
    private activatedRoute:ActivatedRoute,
    public cartService:CartService,
    public dataProvider:DataProviderService,
    private modalController:ModalController,
    private loadingController: LoadingController,
    private paymentService:PaymentService
  ) {
    
    this.activatedRoute.params.subscribe(params => {
      
    })
  }
  ngOnInit(): void {
   
  }

  showAllVariants(modal:any){
    modal.setCurrentBreakpoint(0.75);
    this.isAddToCart = true;
    this.modal = modal;
  }
  ViewCart(modal:any){
  this.showModal = false;
  this.modal.setCurrentBreakpoint(0.3);
  $("#modal3").hide();
    this.router.navigate(['/authorized/cart/all/all']);
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
}

import { Pipe, PipeTransform } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Pipe({
  name: 'removeExtraBr'
})
export class RemoveExtraBrPipe implements PipeTransform {
  
    transform(value: any, args?: any): any {
      return value.replace(/<br>/g, '');
    }
  
  }
  