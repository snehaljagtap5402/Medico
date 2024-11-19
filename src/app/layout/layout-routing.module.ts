import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { InsertAddressesComponent } from '../modules/user/insert-addresses/insert-addresses.component';
import { UpdateAccountDetailComponent } from '../modules/user/update-account-detail/update-account-detail.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { AllOrdersComponent } from '../modules/user/all-orders/all-orders.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { AuthGuard } from '../shared/services/modules/auth.guard';
import { ViewOrderComponent } from '../modules/user/view-order/view-order.component';
import { dashboardComponent } from '../modules/user/dashboard/dashboard.component';
import { AdminLoginComponent } from '../modules/admin/admin-login/admin-login.component';
import { adminAuthGuard } from '../shared/services/modules/admin-auth.guard';
const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    loadChildren: () => import('../modules/product/product.module').then((x) => x.ProductModule),
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'contact-us',
        component: ContactDetailsComponent
      },
      {
        path: 'privacy-policy',
        component: PrivacyComponent
      },
      {
        path: 'terms-conditions',
        component: TermsConditionsComponent
      },
    ]
  },
  // {
  //   path: 'user/dashboard',
  //   component: LayoutComponent,
  //   loadChildren: () => import('../modules/user/user.module').then((x) => x.UserModule),canActivate: [AuthGuard]
  // },
  {
    path: 'user/dashboard',
    component: LayoutComponent,
    loadChildren: () => import('../modules/user/user.module').then((x) => x.UserModule), canActivate: [AuthGuard]
  },
  {
    path: 'user/dashboard',
    component: LayoutComponent, pathMatch: 'full',
    children: [
      {
         path: 'insert-addresses/:id',
        component: InsertAddressesComponent    
      },
      {
        path: 'update-account-detail/:id',
        component: UpdateAccountDetailComponent
      },
      {
        path: 'view-orders',
        component: AllOrdersComponent
      },
      {
        path: 'view-order/:orderId',
        component: ViewOrderComponent
      }  
    ]
  },
  // {
  //   path: 'cart',
  //   component: LayoutComponent,
  //   loadChildren: () => import('../modules/cart/cart.module').then((x) => x.CartModule),canActivate: [AuthGuard]
  // },
  {
    path: 'cart',
    component: LayoutComponent,
    loadChildren: () => import('../modules/cart/cart.module').then((x) => x.CartModule), canActivate: [AuthGuard]
  },
  {
    path: 'info',
    component: LayoutComponent,
    loadChildren: () => import('../modules/info-center/info-center.module').then((x) => x.InfoCenterModule),
  },
  // {
  //   path: 'admin',
  //   component: LayoutComponent,
  //   loadChildren: () => import('../modules/admin/admin.module').then((x) => x.AdminModule), canActivate: [adminAuthGuard]
  // },
  // {
  //   path: 'admin/login',
  //   component: AdminLoginComponent    
  // },
  {
    path: 'admin',
    component: LayoutComponent,
    children: [
      {
        path: 'login',
        component: AdminLoginComponent, 
      },
      {
        path: '',
        loadChildren: () => import('../modules/admin/admin.module').then((x) => x.AdminModule),
        canActivate: [adminAuthGuard],
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
