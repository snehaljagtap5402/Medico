import { RouterModule, Routes } from '@angular/router';
import { dashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { InsertAddressesComponent } from './insert-addresses/insert-addresses.component';
import { UpdateAccountDetailComponent } from './update-account-detail/update-account-detail.component';
import { UpdateAddressComponent } from './update-address/update-address.component';
import { AllOrdersComponent } from './all-orders/all-orders.component';
import { ViewOrderComponent } from './view-order/view-order.component';

const routes: Routes = [
  {
    path: '',
    component: dashboardComponent,
  },
  {
    path: 'insert-addresses/:id',
    component: InsertAddressesComponent
  },
  {
    path: 'update-account-detail/:id',
    component: UpdateAccountDetailComponent
  },
  {
    path: 'update-address-detail/:id/:addressId',
    component: UpdateAddressComponent
  },
  {
    path: 'view-orders',
    component: AllOrdersComponent
  },
  {
    path: 'view-order/:orderId',
    component: ViewOrderComponent
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }



