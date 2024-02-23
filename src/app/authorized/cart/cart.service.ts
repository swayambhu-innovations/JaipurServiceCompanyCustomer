import { Injectable } from '@angular/core';
import { Category, Service, SubCategory } from '../../core/types/category.structure';
import { Firestore, Timestamp, addDoc, collection, collectionData, collectionGroup, deleteDoc, doc, getDoc, getDocs, increment, query, setDoc } from '@angular/fire/firestore';
import { Booking, natureTax } from '../booking/booking.structure';
import { DataProviderService } from 'src/app/core/data-provider.service';
import { Subject, forkJoin } from 'rxjs';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  selectedCatalogue:any;
  cart:Booking[] = [];
  applicableDiscounts :any[] = [];
  discounts:any[] = [];
  userCurrentAddress:any = {};
  taxes:any[] = [];
  cartSubject:Subject<Booking[]> = new Subject<Booking[]>();
  fixedCharges: any;
  constructor(
    private firestore:Firestore,
    private dataProvider:DataProviderService,
    private loadingController: LoadingController
  ) {

      dataProvider.selectedAddress.subscribe(address=>{
        this.userCurrentAddress = address;
      })
    forkJoin({
      discountRequest: this.getDiscounts(),
      cartRequest: this.getCurrentUserCart(),
      taxRequest : this.getTaxes()
    })
    .subscribe(({discountRequest, cartRequest, taxRequest}) => {
      this.cart = cartRequest.docs.map((cart:any) => {
        return { ...cart.data(),id: cart.id };
      });
      this.discounts = discountRequest.docs.map((discount:any) => {
        return { ...discount.data(),id: discount.id };
      });
      this.taxes = taxRequest.docs.map((tax:any) => {
        return { ...tax.data(),id: tax.id };
      });
      this.cart.map((cartItem:any) => {
        cartItem = this.calculateBilling(cartItem);
        return cartItem;
      });
      this.cartSubject.next(this.cart);
      
    });

    
  }

  async getServices(serviceCatalogueId:string,mainCategoryId: string, subCategoryId: string) {
    return await Promise.all(
      (
        await getDocs(
          collection(
            this.firestore,
            'service-catalogue',
            serviceCatalogueId,
            'categories',
            mainCategoryId,
            'categories',
            subCategoryId,
            'services'
          )
        )
      ).docs.map((service) => {
        return {
          id: service.id,
          name: service.data()['name'],
          image: service.data()['image'],
          video: service.data()['video'],
          color:service.data()['color'],
          hsnCode:service.data()['hsnCode'],
          reviewEditable:service.data()['reviewEditable'],
          description: service.data()['description'],
          enabled: service.data()['enabled'],
          allowReviews: service.data()['allowReviews'],
          taxes:service.data()['taxes'],
          tags:service.data()['tags'],
          services: service.data()['services'],
          taxType:service.data()['taxType'],
          discounts: service.data()['discounts'],
          variants: service.data()['variants'],
        };
      })
    );
  }

  async addToCart(userId:string,variantId:string,service:Service,mainCategory:Category,subCategory:SubCategory){
    const loader = await this.loadingController.create({message:'Please wait...'});
    loader.present();
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
                actualJobDuration : variant.actualJobDuration ?? 0,
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
                  actualJobDuration : variant.actualJobDuration ?? 0,
                  mainCategoryId:mainCategory.id,
                  name:variant.name,
                  price:variant.price,
                  serviceId:service.id,
                  subCategoryId:subCategory.id,
                  variantId:variant.id,
                }
              ],
              video:service.video,
              color: service.color,
              taxType: service.taxType,
            });
          }
          await setDoc(doc(this.firestore,'users',userId,'cart',data.id!),data);
          this.updateCart();
          setTimeout(() => {
            loader.dismiss();
          }, 1000);
          
          return;
        }
      }
      let data:Booking = {
        mainCategory:{
          id:mainCategory.id,
          name:mainCategory.name,
          image:mainCategory.image,
          icon:mainCategory.icon
        },
        subCategory:{
          id:subCategory.id,
          name:subCategory.name,
          image:subCategory.image,
          icon:subCategory.icon
        },
        isPaid:false,
        isPaylater:false,
        address:this.userCurrentAddress,
        isUpdateSlot:false,
        picsAfter:[],
        picsBefore:[],
        cancelReason:'',
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
                actualJobDuration : variant.actualJobDuration ?? 0,
                mainCategoryId:mainCategory.id,
                name:variant.name,
                price:variant.price,
                serviceId:service.id,
                subCategoryId:subCategory.id,
                variantId:variant.id,
              }
            ],
            video:service.video,
            color: service.color,
            taxType: service.taxType,
          }
        ],
        currentUser:{
          name:this.dataProvider.currentUser!.user.displayName!,
          phoneNumber:this.dataProvider.currentUser!.user.phoneNumber!,
          userId:this.dataProvider.currentUser!.user.uid
        },
        stage:'allotmentPending',
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
        createdAt:Timestamp.fromDate(new Date()),
        timeSlot: {
          date: Timestamp.fromDate(new Date()),
          agentArrivalTime: Timestamp.fromDate(new Date()),
          time: {
            // anukul changes
            startTime : Timestamp.fromDate(new Date()),
            endTime : Timestamp.fromDate(new Date()),
          },
          id : ''
        }
      };
      await addDoc(collection(this.firestore,'users',userId,'cart'),data);
      this.updateCart();
    }
    setTimeout(() => {
      loader.dismiss();
    }, 1000);
  }

  async removeFromCart(userId:string,serviceId:string,variantId:string,bookingId:string){
    const loader = await this.loadingController.create({message:'Please wait...'});
    loader.present();
    let cart = await getDoc(doc(this.firestore,'users',userId,'cart',bookingId));
    let data:Booking = cart.data() as unknown as Booking;
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
      await this.clearCart(userId,bookingId);
    }else{
      await setDoc(doc(this.firestore,'users',userId,'cart',bookingId),data);
    }
    this.updateCart();
    setTimeout(() => {
      loader.dismiss();
    }, 1000);
  }

  async updateCart(){
    this.getCurrentUserCart().then((cartRequest) => {
      this.cart = cartRequest.docs.map((cart:any) => {
        return { ...cart.data(),id: cart.id };
      });
      this.cart.map((cartItem:any) => {
        cartItem = this.calculateBilling(cartItem);
        return cartItem;
      });
      this.cartSubject.next(this.cart);
      this.cart.map(async (cartItem:any) => {
        await setDoc(doc(this.firestore,'users',this.dataProvider.currentUser?.user!.uid!,'cart',cartItem.id),cartItem);
      });
      
    });
  }

  async incrementQuantity(userId:string,service:any,variantId:string,bookingId:string){
    let cart = this.cart.find((bookingItem) => {
      return bookingItem.id == bookingId;
    });
    let data:any = cart;
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
    setDoc(doc(this.firestore,'users',userId,'cart',bookingId),data);
  }

  async incrementFormQuantity(userId:string,service:any,variantId:string,bookingId:string){
    let cart = this.cart.find((bookingItem) => {
      return bookingItem.id == bookingId;
    });
    let data:any = cart;
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
    setDoc(doc(this.firestore,'users',userId,'cart',bookingId),data);
  }

  async decrementQuantity(userId:string,service:any,variantId:string,bookingId:string){
    let cart = this.cart.find((bookingItem) => {
      return bookingItem.id == bookingId;
    });
    let data:any = cart;
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
    setDoc(doc(this.firestore,'users',userId,'cart',bookingId),data);
  }

  async decrementFormQuantity(userId:string,service:any,variantId:string,bookingId:string){
    let cart = this.cart.find((bookingItem) => {
      return bookingItem.id == bookingId;
    });
    let data:any = cart;
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
    setDoc(doc(this.firestore,'users',userId,'cart',bookingId),data);
  }

  onRemoveCoupon(userId,bookingId,data){
    setDoc(doc(this.firestore,'users',userId,'cart',bookingId),data);
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

  async clearCart(userId:string,bookingId:string){
    await deleteDoc(doc(this.firestore,'users',userId,'cart',bookingId!));
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
    let totalActualJobTime = 0;
    booking.billing.coupanDiscunt = 0;
    

    if(booking.services){
      for (const service of booking?.services) {

        const filteredDiscounts = this.discounts.filter((s) => {
          const discountItems = service.discounts.filter((discount:any) => {
            return discount == s.id;
          });
          return discountItems.length;
        });
        service.discountsApplicable = [...filteredDiscounts]

        // we will first calculate the original price
        const taxesList = service.taxes;
        const filteredTaxes = this.taxes.filter((s) => {
          const taxesItems = taxesList.filter((tax:any) => {
            return tax == s.id;
          });
          return taxesItems.length;
        });
        service.taxes = filteredTaxes;


        service.variants.forEach((variant)=>{
          variant.billing.originalPrice = variant.quantity * variant.price;
          // we will now calculate the total tax
          variant.billing.tax = 0;
          if (service.taxType.toLowerCase() === 'exclusive') {
            for (const tax of service.taxes) {
              if (tax.type == 'percentage'){
                variant.billing.tax += (variant.billing.originalPrice * tax.rate) / 100;
              } else {
                variant.billing.tax += tax.rate;
              }
            }
          }
          // we will now calculate the total discount
          variant.billing.discount = 0;
          for (const discount of this.applicableDiscounts) {
            
            if(booking.appliedCoupon?.id == discount.id){
              if(booking.appliedCoupon !== undefined && booking.appliedCoupon?.type == "flat" || booking.appliedCoupon?.type == "fixed"){
                if(variant.price >= (booking.appliedCoupon?.minimumRequiredAmount ?? 0))
                {
                  variant.billing.discount = (+discount.value);
                }
              }else if(booking.appliedCoupon !== undefined){
                if(variant.price >= (booking.appliedCoupon?.minimumRequiredAmount ?? 0))
                {
                  variant.billing.discount = parseFloat(((booking.appliedCoupon.value*variant.price)/100).toFixed(2));
                }
              }
              if(booking.appliedCoupon?.maximumDiscountAmount && variant.billing.discount > (booking.appliedCoupon?.maximumDiscountAmount)){
                variant.billing.discount = (+booking.appliedCoupon?.maximumDiscountAmount)
              }
            }
          }
          // we will now calculate the total price
          variant.billing.totalPrice = variant.billing.originalPrice + variant.billing.tax - variant.billing.discount;
          // we will now calculate the discounted price
          variant.billing.discountedPrice = variant.billing.originalPrice - variant.billing.discount;
          // we will now calculate the untaxed price
          variant.billing.untaxedPrice = variant.billing.originalPrice - variant.billing.tax;
          // we will now calculate the total job acceptance charge
          totalJobAcceptanceCharge += ((+variant.jobAcceptanceCharge)*variant.quantity);
          // we will now calculate the total job time
          totalJobTime += (+variant.jobDuration);
          totalActualJobTime += (+variant.actualJobDuration);
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
          if(variant.billing.tax)
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
      booking.billing.grandTotal = booking.billing.subTotal + booking.billing.tax - booking.billing.discount
      booking.billing.coupanDiscunt = 0;
      if(booking.appliedCoupon !== undefined && booking.appliedCoupon?.type == "flat" || booking.appliedCoupon?.type == "fixed"){
        booking.billing.coupanDiscunt = booking.appliedCoupon.value;
        booking.billing.grandTotal = booking.billing.grandTotal -booking.billing.coupanDiscunt;
      }else if(booking.appliedCoupon !== undefined){
        booking.billing.coupanDiscunt =  parseFloat(((booking.appliedCoupon.value*booking.billing.grandTotal)/100).toFixed(2));
        booking.billing.grandTotal = booking.billing.grandTotal -booking.billing.coupanDiscunt;
      }

      let fixedCharges = 0;
      this.fixedCharges?.map((charge) => {
          fixedCharges+= (+(charge.amount))
      });
      booking.billing.grandTotal+= fixedCharges;


    // we will now calculate the grand total
   
      booking.billing.totalJobAcceptanceCharge = totalJobAcceptanceCharge;
      booking.billing.totalJobTime = totalJobTime;
      booking.billing.totalActualJobTime = totalActualJobTime;
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

  
  applyCoupon(bookingId:string, selectedCoupan:any){
    this.cart.map((bookingItem) =>{
      if(bookingItem.id == bookingId){
        bookingItem.appliedCoupon = selectedCoupan;
      }
    })
  }

  removeCoupon(bookingId:string){
    this.cart.map((bookingItem) =>{
      if(bookingItem.id == bookingId){
        //bookingItem.appliedCoupon = undefined;
        delete bookingItem.appliedCoupon;
      }
    })
  }

  getDiscounts(){
    return getDocs(collectionGroup(this.firestore,'coupons'));
  }

  getCurrentUserCart(){
    return getDocs(collection(this.firestore,'users',this.dataProvider.currentUser!.user.uid,'cart'));
  }
  
  getTaxes(){
    return getDocs(collectionGroup(this.firestore,'taxes'));
  }

  getFixedCharges() {
    return getDocs(
      query(collection(this.firestore, 'customer-settings','fixed-charges', 'charges'))
    );
  }

}
