import { IProductImage } from "./iproduct-image";

export interface Product {
  stockId: string;
  alloyId: string;
  productRef: string;
  base64Image: string;
  productDescription: string;
  productType: string;
  sellPrice: number;
  groupDesc: string;
  groupId: string;
  unitsOf: number;
  categoryCode : string;
  qtyDescription: string;
  vatCode: string;
  PictFile : string;
  averageCost: number;
  perQty: number;
  isObsolete: boolean;
  isNonStockItem: boolean;
  isServiceItem: boolean;
  inStock: any; 
  available: any;
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  subCode : string;
  groupcode : string;

  idStock?: number;
  aliasId: string;
  reference: string;
  shortDesc?: string;
  longDesc?: string;
  image?: string;
  imagePath?: string;
  imageCollection?: IProductImage[];
  aliasQty?: number;
  
  selectedQty?: number;
  cartQty?: number;
  inBasket?: boolean;
  height?: number;
  width?: number;
  depth?: number;
  weight?: number;
  serviceType?: string;
  selectedServiceType?: string;
  //selectedLocation?: IProductLocation;
  //locations?: IProductLocation[];
  configTables?: number[];
  configEntries?:number[];
  analysisTables?: string[];
  analysisEntries?: string[];

  rating: number;
  isWishlist: boolean;
  price: { [currency: string]: number };
  alloys: { [key: string]: Alloy[] };
  refcodes: {
    refcode: string;
    description: string;
    prices: { [currency: string]: number };
  }[];
  categoryId: number;
  sizes: string[]; 
    selectedSize: string,
    quantity: 1,
}

export interface Alloy {
  refcode: string;
  alloyDescription: string;
  prices: {
    GBP: number;
    USD: number;
    EUR: number;
    AUD: number;
  };
}
