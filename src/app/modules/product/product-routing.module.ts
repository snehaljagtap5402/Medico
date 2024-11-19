import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllProductsComponent } from './all-products/all-products.component';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductRefcodeDetailsComponent } from './product-refcode-details/product-refcode-details.component';
import { SheetsComponent } from './sheets/sheets.component';
import { HomeComponent } from '../home/home.component';
import { RoundWireCategoryComponent } from './round-wire-category/round-wire-category.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { GlobalSearchComponent } from './global-search/global-search.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent, pathMatch: 'full'
  },
  {
    path: 'all-products',
    component: AllProductsComponent
  },
  {
    path: 'product-categories',
    component: ProductCategoryComponent
  },
  {
    path: 'products/:groupCode/:subcategoryCode/:alloyId?', 
    component: RoundWireCategoryComponent
  },
  {
    path: 'products/:groupCode/:subcategoryCode', 
    component: RoundWireCategoryComponent
  },
  // {
  //   path: 'global-search', 
  //   component: GlobalSearchComponent
  // },

  // {
  //   path: 'global-search', 
  //   component: RoundWireCategoryComponent
  // },

  {
    path: 'global-search/:search', 
    component: RoundWireCategoryComponent
  },

  // {
  //   path: 'product-detail/:alloyId?', 
  //   component: ProductDetailsComponent
  //  },

  {
    path: 'product-detail/:id/:alloyId/:groupCode/:subcategoryCode', 
    component: ProductDetailsComponent
  },

  {
    path: 'product-detail/:id/:refcode',
    component: ProductRefcodeDetailsComponent
  },

  // {
  //   path: 'product-detail/:id/refcode/:refcode',
  //   component: ProductRefcodeDetailsComponent
  // },
  {
    path: 'Sheet',
    component: SheetsComponent, pathMatch: 'full'
  },
  {
    path: 'wishlist',
    component: WishlistComponent, pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
