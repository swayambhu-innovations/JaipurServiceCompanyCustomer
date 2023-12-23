export interface Category {
  id: string;
  name: string;
  image: string;
  subCategories: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
  image: string;
  services: Service[];
  selected: boolean;
}

export interface Service {
  id: string;
  name: string;
  image: string;
  video: string;
  description: any;
  enabled: boolean;
  allowReviews: boolean;
  price: number;
  taxes: any[];
  discounts: any[];
  variants: {
    price: number;
    name: string;
    description: string;
    jobDuration: number;
    jobAcceptanceCharge: number;
  }[];
}
