import { Component, OnInit } from '@angular/core';
import { Service, SubCategory, Category } from '../home/home.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataProviderService } from '../data-provider.service';
import { firstValueFrom } from 'rxjs';
import { PaymentService } from '../payment.service';

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
  constructor(private dataProvider:DataProviderService,private activatedRoute:ActivatedRoute,private router:Router,private paymentService:PaymentService) {
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

  bookNow(){
    this.paymentService.handlePayment({
      grandTotal: this.matchingService?.price || 0,
      user: {
        displayName: "Kumar Saptam",
        email: "saptampro2003@gmail.com",
        phone:'9026296062'
      }
    })
  }

}
