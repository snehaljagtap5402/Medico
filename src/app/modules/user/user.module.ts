import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { dashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { InsertAddressesComponent } from './insert-addresses/insert-addresses.component';
import { ValidationMessageComponent } from 'src/app/shared/components/validation-message/validation-message.component';
import { UpdateAccountDetailComponent } from './update-account-detail/update-account-detail.component';
import { UpdateAddressComponent } from './update-address/update-address.component';
import { AllOrdersComponent } from './all-orders/all-orders.component';
import { ViewOrderComponent } from './view-order/view-order.component';


@NgModule({
  declarations: [
    dashboardComponent,
    InsertAddressesComponent,
    ValidationMessageComponent,
    UpdateAccountDetailComponent,
    UpdateAddressComponent,
    AllOrdersComponent,
     ViewOrderComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  
})
export class UserModule { }
