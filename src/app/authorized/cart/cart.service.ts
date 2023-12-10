import { Injectable } from '@angular/core';
import { Category, Service, SubCategory } from '../../core/types/category.structure';
import { Firestore, Timestamp, addDoc, collection, collectionData, deleteDoc, doc, getDoc, getDocs, increment, setDoc } from '@angular/fire/firestore';
import { Booking, natureTax } from '../booking/booking.structure';
import { DataProviderService } from 'src/app/core/data-provider.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cart:Booking[] = [];
  cartSubject:Subject<Booking[]> = new Subject<Booking[]>();
  constructor(private firestore:Firestore,private dataProvider:DataProviderService) {
    collectionData(collection(this.firestore,'users',this.dataProvider.currentUser!.user.uid,'cart'),{idField:'id'}).subscribe((cart)=>{
      this.cart = cart as Booking[];
      this.cart.forEach(this.calculateBilling);
      this.cartSubject.next(this.cart);
    });
  }

  async addToCart(userId:string,variantId:string,service:Service,mainCategory:Category,subCategory:SubCategory){
    let variant = service.variants.find(v=>v.id == variantId);
    if (variant){
      for (const data of this.cart) {
        if (data.mainCategory.id == mainCategory.id && data.subCategory.id == subCategory.id){
          let serviceIndex = data.services.findIndex(s=>s.serviceId == service.id);
          if (serviceIndex!=-1){
            let variantIndex = data.services[serviceIndex].variants.findIndex(v=>v.variantId == variantId);
            if (data.services[serviceIndex].variants[variantIndex]){
                data.services[serviceIndex].variants[variantIndex].quantity++;
            } else {
              // add variant to the service
              data.services[serviceIndex].variants.push({
                billing:{
                  discountedPrice:0,
                  originalPrice:0,
                  discount:0,
                  tax:0,
                  totalPrice:0,
                  untaxedPrice:0
                },
                quantity:1,
                description:variant.description,
                jobAcceptanceCharge:variant.jobAcceptanceCharge,
                jobDuration:variant.jobDuration,
                mainCategoryId:mainCategory.id,
                name:variant.name,
                price:variant.price,
                serviceId:service.id,
                subCategoryId:subCategory.id,
                variantId:variant.id,
              })
            }
          } else {
            data.services.push({
              name:service.name,
              allowReviews:service.allowReviews,
              description:service.description,
              discounts:service.discounts,
              image:service.image,
              serviceId:service.id,
              taxes:service.taxes,
              variants:[
                {
                  billing:{
                    discountedPrice:0,
                    originalPrice:0,
                    discount:0,
                    tax:0,
                    totalPrice:0,
                    untaxedPrice:0
                  },
                  quantity:1,
                  description:variant.description,
                  jobAcceptanceCharge:variant.jobAcceptanceCharge,
                  jobDuration:variant.jobDuration,
                  mainCategoryId:mainCategory.id,
                  name:variant.name,
                  price:variant.price,
                  serviceId:service.id,
                  subCategoryId:subCategory.id,
                  variantId:variant.id,
                }
              ],
              video:service.video
            });
          }
          console.log(userId,data);
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
            name:service.name,
            allowReviews:service.allowReviews,
            description:service.description,
            discounts:service.discounts,
            image:service.image,
            serviceId:service.id,
            taxes:service.taxes,
            variants:[
              {
                billing:{
                  discountedPrice:0,
                  originalPrice:0,
                  discount:0,
                  tax:0,
                  totalPrice:0,
                  untaxedPrice:0
                },
                quantity:1,
                description:variant.description,
                jobAcceptanceCharge:variant.jobAcceptanceCharge,
                jobDuration:variant.jobDuration,
                mainCategoryId:mainCategory.id,
                name:variant.name,
                price:variant.price,
                serviceId:service.id,
                subCategoryId:subCategory.id,
                variantId:variant.id,
              }
            ],
            video:service.video
          }
        ],
        currentUser:{
          name:this.dataProvider.currentUser!.user.displayName!,
          phoneNumber:this.dataProvider.currentUser!.user.phoneNumber!,
          userId:this.dataProvider.currentUser!.user.uid
        },
        stage:'unassigned',
        jobOtp:this.generateOtpCode(),
        billing:{
          grandTotal:0,
          tax:0,
          discount:0,
          subTotal:0,
          totalJobTime:0,
          totalJobAcceptanceCharge:0
        },
        id:this.generateJobId(),
        createdAt:Timestamp.fromDate(new Date())
      };
      console.log(data);
      await addDoc(collection(this.firestore,'users',userId,'cart'),data);
    }
  }

  async removeFromCart(userId:string,serviceId:string,variantId:string,bookingId:string){
    let cart = await getDoc(doc(this.firestore,'users',userId,'cart',bookingId));
    let data:Booking = cart.data() as unknown as Booking;
    //debugger
    let serviceIndex = data.services.findIndex(s=>s.serviceId == serviceId);
    if (serviceIndex != -1 && data.services[serviceIndex].variants.length === 1){
      data.services.splice(serviceIndex,1);
    }
     serviceIndex = data.services.findIndex(s=>s.serviceId == serviceId);
    if (serviceIndex != -1 && data.services[serviceIndex].variants.length >1){
    let variantIndex = data.services[serviceIndex].variants.findIndex(v=>v.variantId == variantId);
      if(variantIndex != -1){
        data.services[serviceIndex].variants.splice(variantIndex,1);
      }
    }
    if(data.services.length ===0){
      console.log("clearCart.......: ",data)
      await this.clearCart(userId);
    }else{
      console.log("removeFromCart.......: ",data)
      await setDoc(doc(this.firestore,'users',userId,'cart',bookingId),data);
    }
   
  }

  async incrementQuantity(userId:string,service:any,variantId:string,bookingId:string){
    debugger
    let cart = await getDoc(doc(this.firestore,'users',userId,'cart',bookingId));
    let data:Booking = cart.data() as unknown as Booking;
    let serviceIndex = data.services.findIndex(s=>s.serviceId == service.id);
    if (serviceIndex != -1){
      let variantIndex = data.services[serviceIndex].variants.findIndex(v=>v.variantId == variantId);
      if (variantIndex != -1){
        data.services[serviceIndex].variants[variantIndex] = {
          ...data.services[serviceIndex].variants[variantIndex],
          quantity:data.services[serviceIndex].variants[variantIndex].quantity + 1
        } as any;
      }
    }
    this.calculateBilling(data);
    await setDoc(doc(this.firestore,'users',userId,'cart',bookingId),data);
  }
  async incrementFormQuantity(userId:string,service:any,variantId:string,bookingId:string){
    let cart = await getDoc(doc(this.firestore,'users',userId,'cart',bookingId));
    let data:Booking = cart.data() as unknown as Booking;
    let serviceIndex = data.services.findIndex(s=>s.serviceId == service.serviceId);
    if (serviceIndex != -1){
      let variantIndex = data.services[serviceIndex].variants.findIndex(v=>v.variantId == variantId);
      if (variantIndex != -1){
        data.services[serviceIndex].variants[variantIndex] = {
          ...data.services[serviceIndex].variants[variantIndex],
          quantity:data.services[serviceIndex].variants[variantIndex].quantity + 1
        } as any;
      }
    }
    this.calculateBilling(data);
    await setDoc(doc(this.firestore,'users',userId,'cart',bookingId),data);
  }
  async decrementQuantity(userId:string,service:any,variantId:string,bookingId:string){
    let cart = await getDoc(doc(this.firestore,'users',userId,'cart',bookingId));
    let data:Booking = cart.data() as unknown as Booking;
    let serviceIndex = data.services.findIndex(s=>s.serviceId == service.id);
    if (serviceIndex != -1){
      let variantIndex = data.services[serviceIndex].variants.findIndex(v=>v.variantId == variantId);
      if (variantIndex != -1){
        if(data.services[serviceIndex].variants[variantIndex].quantity === 1){
          data.services[serviceIndex].variants.splice(variantIndex,1);
        }else{
          data.services[serviceIndex].variants[variantIndex] = {
            ...data.services[serviceIndex].variants[variantIndex],
            quantity:data.services[serviceIndex].variants[variantIndex].quantity - 1
          } as any;
        }
      }
    }
    this.calculateBilling(data);
    await setDoc(doc(this.firestore,'users',userId,'cart',bookingId),data);
  }
  async decrementFormQuantity(userId:string,service:any,variantId:string,bookingId:string){
    let cart = await getDoc(doc(this.firestore,'users',userId,'cart',bookingId));
    let data:Booking = cart.data() as unknown as Booking;
    let serviceIndex = data.services.findIndex(s=>s.serviceId == service.serviceId);
    if (serviceIndex != -1){
      let variantIndex = data.services[serviceIndex].variants.findIndex(v=>v.variantId == variantId);
      if (variantIndex != -1){
        if(data.services[serviceIndex].variants[variantIndex].quantity === 1){
          data.services[serviceIndex].variants.splice(variantIndex,1);
        }else{
          data.services[serviceIndex].variants[variantIndex] = {
            ...data.services[serviceIndex].variants[variantIndex],
            quantity:data.services[serviceIndex].variants[variantIndex].quantity - 1
          } as any;
        }
      }
    }
    this.calculateBilling(data);
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

  generateOtpCode(){
    // 6 digit number
    let code = '';
    for(let i=0;i<6;i++){
      code += Math.floor(Math.random()*10);
    }
    return code;
  }

  generateJobId(){
    // 16 chars alpha num
    let code = '';
    let chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for(let i=0;i<16;i++){
      code += chars[Math.floor(Math.random()*chars.length)];
    }
    return code;
  }

  calculateBilling(booking:Booking){
    let totalJobAcceptanceCharge = 0;
    let totalJobTime = 0;
    if(booking.services){
      for (const service of booking?.services) {
        // we will first calculate the original price
        service.variants.forEach((variant)=>{
          variant.billing.originalPrice = variant.quantity * variant.price;
          // we will now calculate the total tax
          variant.billing.tax = 0;
          for (const tax of service.taxes) {
            if (tax.nature == 'exclusive'){
              variant.billing.tax += (variant.billing.originalPrice * tax.rate) / 100;
            } else {
              variant.billing.tax += (variant.billing.originalPrice * tax.rate) / (100 + tax.rate);
            }
          }
          // we will now calculate the total discount
          variant.billing.discount = 0;
          for (const discount of service.discounts) {
            if (discount.type == 'percentage'){
              variant.billing.discount += (variant.billing.originalPrice * discount.amount) / 100;
            } else {
              variant.billing.discount += discount.amount;
            }
          }
          // we will now calculate the total price
          variant.billing.totalPrice = variant.billing.originalPrice + variant.billing.tax - variant.billing.discount;
          // we will now calculate the discounted price
          variant.billing.discountedPrice = variant.billing.originalPrice - variant.billing.discount;
          // we will now calculate the untaxed price
          variant.billing.untaxedPrice = variant.billing.originalPrice - variant.billing.tax;
          // we will now calculate the total job acceptance charge
          totalJobAcceptanceCharge += variant.jobAcceptanceCharge;
          // we will now calculate the total job time
          totalJobTime += variant.jobDuration;
        })
      }
      // we will now calculate the billing for the booking
      // we will first calculate the sub total
      booking.billing.subTotal = 0;
      for (const service of booking.services) {
        for (const variant of service.variants) {
          booking.billing.subTotal += variant.billing.originalPrice;
        }
      }
      booking.billing.subTotal 
      // we will now calculate the total tax
      booking.billing.tax = 0;
      for (const service of booking.services) {
        for (const variant of service.variants) {
          booking.billing.tax += variant.billing.tax;
        }
      }
      // we will now calculate the total discount
      booking.billing.discount = 0;
      for (const service of booking.services) {
        for (const variant of service.variants) {
          if(variant.billing.discount)
          booking.billing.discount += variant.billing.discount;
        }
      }
      
    // we will now calculate the grand total
    booking.billing.grandTotal = booking.billing.subTotal + booking.billing.tax - booking.billing.discount
    booking.billing.totalJobAcceptanceCharge = totalJobAcceptanceCharge;
    booking.billing.totalJobTime = totalJobTime;
    }
    
    return booking;
  }

  isInCart(service:Service,variantId:string,mainCategoryId:string,subCategoryId:string){
    for (const booking of this.cart) {
      if (booking.mainCategory.id == mainCategoryId && booking.subCategory.id == subCategoryId){
        let serviceIndex = booking.services.findIndex(s=>s.serviceId == service.id);
        if (serviceIndex != -1){
          let index = booking.services[serviceIndex].variants.findIndex(v=>v.variantId == variantId);
          if (index != -1){
            return true;
          }
        }
      }
    }
    return false;
  }
  getQuantity(service:Service,variantId:string,mainCategoryId:string,subCategoryId:string){
    for (const booking of this.cart) {
      if (booking.mainCategory.id == mainCategoryId && booking.subCategory.id == subCategoryId){
        let serviceIndex = booking.services.findIndex(s=>s.serviceId == service.id);
        if (serviceIndex != -1){
          let index = booking.services[serviceIndex].variants.findIndex(v=>v.variantId == variantId);
          if (index != -1){
            return booking.services[serviceIndex].variants[index].quantity;
          }else{
            return 1;
          }
        }
      }
    }
    return 1;
  }
  getServiceBill(service:Service,mainCategoryId:string,subCategoryId:string){
    let serviceBill = 0;
    for (const booking of this.cart) {
      if (booking.mainCategory.id == mainCategoryId && booking.subCategory.id == subCategoryId){
        let serviceIndex = booking.services.findIndex(s=>s.serviceId == service.id);
        if (serviceIndex != -1){
          booking.services[serviceIndex].variants.forEach((variant:any)=>{
            serviceBill += (variant.price * variant.quantity);
          });
        }
      }
    }
    
    return serviceBill;
  }
  getServiceQuantity(service:Service,mainCategoryId:string,subCategoryId:string){
    let totalQuantity = 0;
    for (const booking of this.cart) {
      if (booking.mainCategory.id == mainCategoryId && booking.subCategory.id == subCategoryId){
        let serviceIndex = booking.services.findIndex(s=>s.serviceId == service.id);
        if (serviceIndex != -1){
          booking.services[serviceIndex].variants.forEach((variant:any)=>{
            totalQuantity += variant.quantity;
          });
        }
      }
    }
    return totalQuantity;
  }

  deleteBooking(userId:string,bookingId:string){
    return deleteDoc(doc(this.firestore,'users',userId,'cart',bookingId));
  }

}
