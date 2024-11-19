import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductRoutingModule } from './product-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AllProductsComponent } from './all-products/all-products.component';
import { ProductCardComponent } from './product-card/product-card.component';
import { FormsModule } from '@angular/forms';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { GroupByPipe } from './group-by.pipe';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CurrencyFormatPipe } from './currency-format.pipe';
import { ProductRefcodeDetailsComponent } from './product-refcode-details/product-refcode-details.component';
import { SheetsComponent } from './sheets/sheets.component';
import {MatTabsModule} from '@angular/material/tabs';
import { HomeComponent } from '../home/home.component';
import { RoundWireCategoryComponent } from './round-wire-category/round-wire-category.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginatorComponent } from './paginator/paginator.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { GlobalSearchComponent } from './global-search/global-search.component';


@NgModule({
  declarations: [
    AllProductsComponent,
    ProductCardComponent,
    ProductCategoryComponent,
    GroupByPipe,
    ProductDetailsComponent,
    CurrencyFormatPipe,
    ProductRefcodeDetailsComponent,
    SheetsComponent,
    HomeComponent,
    RoundWireCategoryComponent,
    PaginatorComponent,
    WishlistComponent,
    GlobalSearchComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ProductRoutingModule,
    FormsModule,
    MatTabsModule,
    NgxPaginationModule,
  ],
  exports:[
    AllProductsComponent
  ]
})
export class ProductModule { }
