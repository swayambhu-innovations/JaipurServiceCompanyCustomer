import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataProviderService } from '../../core/data-provider.service';
import { firstValueFrom } from 'rxjs';
import { PaymentService } from '../../payment.service';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.page.html',
  styleUrls: ['./service-detail.page.scss'],
})
export class ServiceDetailPage implements OnInit {
  matchingService:Service|undefined;
  matchingSubCategory:SubCategory|undefined;
  matchingMainCategory:Category|undefined;
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
    });
  }

  ngOnInit() {
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

  addToCart(variantId:string){
    this.cartService.addToCart(this.dataProvider.currentUser!.user.uid,variantId,this.matchingService!,this.matchingMainCategory!,this.matchingSubCategory!);
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
  