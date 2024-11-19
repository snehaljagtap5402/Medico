import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartComponent } from './cart/cart.component';
import { BillingInformationFormComponent } from './billing-information-form/billing-information-form.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { CartInfoComponent } from './cart-info/cart-info.component';
//kendo
import { IconsModule } from "@progress/kendo-angular-icons";
import { ButtonsModule } from "@progress/kendo-angular-buttons";
import { InputsModule } from "@progress/kendo-angular-inputs";
import { LabelModule } from "@progress/kendo-angular-label";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { LayoutModule } from "@progress/kendo-angular-layout";
import { CartSummeryComponent } from './cart-summery/cart-summery.component';
import { ViewAddedProductComponent } from './view-added-product/view-added-product.component';
import { CheckOutComponent } from './check-out/check-out.component';
import { CheckoutCompleteComponent } from './checkout-complete/checkout-complete.component';
import { PrintOrderComponent } from './print-order/print-order.component';
import { NgxPrintModule } from 'ngx-print';

const routes: Routes = [
  {
    path: '',
    component: CartInfoComponent, pathMatch: 'full',
  },
  {
    path: 'billing-form',
    component: BillingInformationFormComponent, pathMatch: 'full'
  },
  {
    path: 'cart-summary',
    component: CartInfoComponent, pathMatch: 'full'
  },
  {
    path: 'added-product',
    component: ViewAddedProductComponent, pathMatch: 'full'
  },
  {
    path: 'checkout',
    component: CheckOutComponent
  },
  {
    path: 'view-order/:orderId',
    component: PrintOrderComponent
  }  
]

@NgModule({
  declarations: [
    CartComponent, 
    BillingInformationFormComponent,
    CartInfoComponent, 
    CartSummeryComponent, 
    ViewAddedProductComponent, 
    CheckOutComponent, CheckoutCompleteComponent, PrintOrderComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    IconsModule,
    LayoutModule,
    DropDownsModule,    
    LabelModule,
    InputsModule,
    ButtonsModule,
    NgxPrintModule,
    RouterModule.forChild(routes),
  ]
})
export class CartModule { }
