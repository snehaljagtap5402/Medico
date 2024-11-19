import { Product } from "./product.model";

export interface Category {
  id: number;
  categoryName: string;
  categoryCode : string;
  subcategories?: Subcategory[];
  name: string;
  Products: Product[];
}

export interface Subcategory {
  subcategoryName: string;
  subcategoryCode: string;
}