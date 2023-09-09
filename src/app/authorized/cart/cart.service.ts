import { Injectable } from '@angular/core';
import { Category, Service, SubCategory } from '../../core/types/category.structure';
import { Firestore, Timestamp, addDoc, collection, collectionData, deleteDoc, doc, getDoc, getDocs, increment, setDoc } from '@angular/fire/firestore';
import { Booking, natureTax } from '../booking/booking.structure';
import { DataProviderService } from 'src/app/core/data-provider.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cart:Booking[] = [];
  constructor(private firestore:Firestore,private dataProvider:DataProviderService) {
    collectionData(collection(this.firestore,'users',this.dataProvider.currentUser!.user.uid,'cart'),{idField:'id'}).subscribe((cart)=>{
      this.cart = cart as Booking[];
      this.cart.forEach(this.calculateBilling);
    });
  }

  async addToCart(userId:string,variantId:string,service:Service,mainCategory:Category,subCategory:SubCategory){
    let variant = service.variants.find(v=>v.id == variantId);
    if (variant){
      for (const data of this.cart) {
        if (data.mainCategory.id == mainCategory.id && data.subCategory.id == subCategory.id){
          let index = data.services.findIndex(s=>s.serviceId == service.id && s.variantId == variantId);
          if (index == -1){
            data.services.push({
              quantity:1,
              price:variant.price,
              jobDuration:variant.jobDuration,
              description:variant.description,
              jobAcceptanceCharge:variant.jobAcceptanceCharge,
              name:variant.name,
              allowReviews:service.allowReviews,
              taxes:service.taxes,
              discounts:service.discounts,
              variantId:variant.id,
              serviceId:service.id,
              mainCategoryId:mainCategory.id,
              subCategoryId:subCategory.id,
              image:service.image,
              video:service.video,
              billing:{
                discountedPrice:0,
                originalPrice:0,
                discount:0,
                tax:0,
                totalPrice:0,
                untaxedPrice:0
              }
            });
          }else{
            data.services[index].quantity++;
          }
          await setDoc(doc(this.firestore,'users',userId,'cart',data.id!),data);
          return;
        }
      }
      let data:Booking = {
        mainCategory:{
          id:mainCategory.id,
          name:mainCategory.name,
          image:mainCategory.image
        },
        subCategory:{
          id:subCategory.id,
          name:subCategory.name,
          image:subCategory.image
        },
        services:[
          {
            quantity:1,
            price:variant.price,
            jobDuration:variant.jobDuration,
            description:variant.description,
            jobAcceptanceCharge:variant.jobAcceptanceCharge,
            name:variant.name,
            allowReviews:service.allowReviews,
            taxes:service.taxes,
            discounts:service.discounts,
            variantId:variant.id,
            serviceId:service.id,
            mainCategoryId:mainCategory.id,
            subCategoryId:subCategory.id,
            image:service.image,
            video:service.video,
            billing:{
              discountedPrice:0,
              originalPrice:0,
              discount:0,
              tax:0,
              totalPrice:0,
              untaxedPrice:0
            }
          }
        ],
        billing:{
          grandTotal:0,
          tax:0,
          discount:0,
          subTotal:0
        },
        createdAt:Timestamp.fromDate(new Date())
      };
      console.log(data);
      await addDoc(collection(this.firestore,'users',userId,'cart'),data);
    }
  }

  async removeFromCart(userId:string,serviceId:string,variantId:string,bookingId:string){
    let cart = await getDoc(doc(this.firestore,'users',userId,'cart',bookingId));
    let data:Booking = cart.data() as unknown as Booking;
    let index = data.services.findIndex(s=>s.serviceId == serviceId && s.variantId == variantId);
    if (index != -1){
      data.services[index].quantity--;
      if (data.services[index].quantity == 0){
        data.services.splice(index,1);
      }
    }
    await setDoc(doc(this.firestore,'users',userId,'cart',bookingId),data);
  }

  async incrementQuantity(userId:string,serviceId:string,variantId:string,bookingId:string){
    let cart = await getDoc(doc(this.firestore,'users',userId,'cart',bookingId));
    let data:Booking = cart.data() as unknown as Booking;
    let index = data.services.findIndex(s=>s.serviceId == serviceId && s.variantId == variantId);
    if (index != -1){
      data.services[index] = {
        ...data.services[index],
        quantity:data.services[index].quantity + 1
      } as any;
    }
    await setDoc(doc(this.firestore,'users',userId,'cart',bookingId),data);
  }

  async decrementQuantity(userId:string,serviceId:string,variantId:string,bookingId:string){
    let cart = await getDoc(doc(this.firestore,'users',userId,'cart',bookingId));
    let data:Booking = cart.data() as unknown as Booking;
    let index = data.services.findIndex(s=>s.serviceId == serviceId && s.variantId == variantId);
    if (index != -1){
      data.services[index] = {
        ...data.services[index],
        quantity:data.services[index].quantity - 1
      } as any;
    }
    await setDoc(doc(this.firestore,'users',userId,'cart',bookingId),data);
  }

  async getCart(userId:string){
    let cart = await getDocs(collection(this.firestore,'users',userId,'cart'));
    let data:Booking[] = [];
    for (const document of cart.docs) {
      if (document.exists()){
        data.push(document.data() as unknown as Booking);
      }
    }
    return data;
  }

  async clearCart(userId:string){
    for (const document of this.cart) {
      await deleteDoc(doc(this.firestore,'users',userId,'cart',document.id!));
    }
  }

  calculateBilling(booking:Booking){
    // export interface Booking {
    // 	id?:string;
    // 	subCategory: {
    // 		id: string;
    // 		name: string;
    // 		image: string;
    // 	};
    // 	mainCategory: {
    // 		id: string;
    // 		name: string;
    // 		image: string;
    // 	};
    // 	services: SelectedService[];
    // 	billing:{
    // 		grandTotal:number;
    // 		tax:number;
    // 		discount:number;
    // 		subTotal:number;
    // 	};
    // 	createdAt:Timestamp;
    // }
    // export interface SelectedService{
    // 	quantity:number;
    // 	// variant variables
    // 	price:number;
    // 	jobDuration:number;
    // 	description:string;
    // 	jobAcceptanceCharge:number;
    // 	name:string;
    // 	// service variables
    // 	image:string;
    // 	video:string;
    // 	allowReviews:boolean;
    // 	taxes:natureTax[];
    // 	discounts:Coupon[];
    // 	// identifiers
    // 	variantId:string;
    // 	serviceId:string;
    // 	mainCategoryId:string;
    // 	subCategoryId:string;
    // 	billing:{
    // 		originalPrice:number;
    // 		totalPrice:number;
    // 		discountedPrice:number;
    // 		tax:number;
    // 		untaxedPrice:number;
    // 	}
    // }

    // export interface natureTax extends Tax{
    // 	nature:'inclusive'|'exclusive';
    // 	totalAppliedAmount?:number;
    // }

    // this is the structure of a booking
    // we have to calculate the billing for each service and then add them up to get the billing for the booking
    // first we will calculate the billing for each service
    for (const service of booking.services) {
      // we will first calculate the original price
      service.billing.originalPrice = service.quantity * service.price;
      // we will now calculate the total tax
      service.billing.tax = 0;
      for (const tax of service.taxes) {
        if (tax.nature == 'exclusive'){
          service.billing.tax += (service.billing.originalPrice * tax.rate) / 100;
        } else {
          service.billing.tax += (service.billing.originalPrice * tax.rate) / (100 + tax.rate);
        }
      }
      // we will now calculate the total discount
      service.billing.discount = 0;
      for (const discount of service.discounts) {
        if (discount.type == 'percentage'){
          service.billing.discount += (service.billing.originalPrice * discount.amount) / 100;
        } else {
          service.billing.discount += discount.amount;
        }
      }
      // we will now calculate the total price
      service.billing.totalPrice = service.billing.originalPrice + service.billing.tax - service.billing.discount;
      // we will now calculate the discounted price
      service.billing.discountedPrice = service.billing.originalPrice - service.billing.discount;
      // we will now calculate the untaxed price
      service.billing.untaxedPrice = service.billing.originalPrice - service.billing.tax;
    }
    // we will now calculate the billing for the booking
    // we will first calculate the sub total
    booking.billing.subTotal = 0;
    for (const service of booking.services) {
      booking.billing.subTotal += service.billing.originalPrice;
    }
    booking.billing.subTotal 
    // we will now calculate the total tax
    booking.billing.tax = 0;
    for (const service of booking.services) {
      booking.billing.tax += service.billing.tax;
    }
    // we will now calculate the total discount
    booking.billing.discount = 0;
    for (const service of booking.services) {
      booking.billing.discount += service.billing.discount;
    }
    // we will now calculate the grand total
    booking.billing.grandTotal = booking.billing.subTotal + booking.billing.tax - booking.billing.discount
    return booking;
  }

  isInCart(service:Service,variantId:string,mainCategoryId:string,subCategoryId:string){
    for (const booking of this.cart) {
      if (booking.mainCategory.id == mainCategoryId && booking.subCategory.id == subCategoryId){
        let index = booking.services.findIndex(s=>s.serviceId == service.id && s.variantId == variantId);
        if (index != -1){
          return true;
        }
      }
    }
    return false;
  }

}
