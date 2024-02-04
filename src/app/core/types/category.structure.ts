export interface Category {
  id: string;
  name: string;
  image: string;
  icon:string;
  description:string,
  enabled?: boolean;
  subCategories: SubCategory[];
  
}
export interface SubCategory {
  id: string;
  name: string;
  image: string;
  icon:string;
  enabled?: boolean;
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
  rating?:any;
  discounts: any[];
  variants: {
    id:string;
    price: number;
    name: string;
    description: string;
    jobDuration: number;
    jobAcceptanceCharge: number;
    actualJobDuration?: any;
  }[];
  color: string;
  averageRating?:string;
}
