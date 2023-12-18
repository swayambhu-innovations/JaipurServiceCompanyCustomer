import { Timestamp } from '@angular/fire/firestore';
import { Service } from '../../core/types/category.structure';
import { Coupon } from '../../coupons.structure';
import { Tax } from '../../taxes.structure';
import { Address } from '../select-address/address.structure';

export interface Booking {
  id: string;
  subCategory: {
    id: string;
    name: string;
    image: string;
  };
  mainCategory: {
    id: string;
    name: string;
    image: string;
  };
  services: SelectedService[];
  appliedCoupon?:Coupon;
  billing: {
    grandTotal: number;
    tax: number;
    coupanDiscunt?:number,
    discount: number;
    subTotal: number;
    totalJobTime: number;
    totalJobAcceptanceCharge: number;
  };
  createdAt: Timestamp;
  jobOtp: string;
  address?: {
    name: string;
    addressLine1: string;
    addressLine2: string;
    pinCode: string;
  };
  timeSlot?: {
    date: Timestamp;
    agentArrivalTime: Timestamp;
    time: {
      // anukul changes
      startTime : Timestamp;
      endTime : Timestamp
    }
  };
  currentUser: {
    userId: string;
    name: string;
    phoneNumber: string;
  };
  payment?: any;
  assignedAgent?: string;
  stage?: string;
}

export interface SelectedService {
  name: string;
  serviceId: string;
  description: string;
  image: string;
  video: string;
  allowReviews: boolean;
  taxes: natureTax[];
  discounts: Coupon[];
  variants: SelectedVariant[];
}


export interface SelectedVariant {
  quantity: number;
  // variant variables
  price: number;
  jobDuration: number;
  description: string;
  jobAcceptanceCharge: number;
  name: string;
  // identifiers
  variantId: string;
  serviceId: string;
  mainCategoryId: string;
  subCategoryId: string;
  billing: {
    originalPrice: number;
    totalPrice: number;
    discount: number;
    discountedPrice: number;
    tax: number;
    untaxedPrice: number;
  };
}

export interface natureTax extends Tax {
  nature: 'inclusive' | 'exclusive';
  totalAppliedAmount?: number;
}
