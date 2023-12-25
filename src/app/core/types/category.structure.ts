export interface Category {
  id: string;
  name: string;
  image: string;
  icon:string;
  description:string,
  subCategories: SubCategory[];
}
export interface SubCategory {
  id: string;
  name: string;
  image: string;
  services: Service[];
}
export interface Service {
  id: string;
  name: string;
  hsnCode:string;
  reviewEditable:string;
  
  image: string;
  video: string;
  description: any;
  enabled: boolean;
  allowReviews: boolean;
  taxes: any[];
  tags:string[];
  taxType:string;
  discounts: any[];
  variants: {
    id:string;
    price: number;
    name: string;
    description: string;
    jobDuration: number;
    jobAcceptanceCharge: number;
  }[];
  color: string;
}
