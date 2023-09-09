import { Timestamp } from "@angular/fire/firestore";
import { Service } from "../../core/types/category.structure";
import { Coupon } from "../../coupons.structure";
import { Tax } from "../../taxes.structure";

export interface Booking {
	id?:string;
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
	billing:{
		grandTotal:number;
		tax:number;
		discount:number;
		subTotal:number;
	};
	createdAt:Timestamp;
}
export interface SelectedService{
	quantity:number;
	// variant variables
	price:number;
	jobDuration:number;
	description:string;
	jobAcceptanceCharge:number;
	name:string;
	// service variables
	image:string;
	video:string;
	allowReviews:boolean;
	taxes:natureTax[];
	discounts:Coupon[];
	// identifiers
	variantId:string;
	serviceId:string;
	mainCategoryId:string;
	subCategoryId:string;
	billing:{
		originalPrice:number;
		totalPrice:number;
		discount:number;
		discountedPrice:number;
		tax:number;
		untaxedPrice:number;
	}
}

export interface natureTax extends Tax{
	nature:'inclusive'|'exclusive';
	totalAppliedAmount?:number;
}