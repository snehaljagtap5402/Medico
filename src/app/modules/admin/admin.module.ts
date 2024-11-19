import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { LayoutRoutingModule } from 'src/app/layout/layout-routing.module';
import { SharedModule } from '@progress/kendo-angular-inputs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddEditAdminuserComponent } from './add-edit-adminuser/add-edit-adminuser.component';
import { AdminuserListComponent } from './adminuser-list/adminuser-list.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminChangePasswordComponent } from './admin-change-password/admin-change-password.component';

@NgModule({
  declarations: [
    AdminLoginComponent,
    AddEditAdminuserComponent,
    AdminuserListComponent,
    AdminDashboardComponent,
    AdminChangePasswordComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    LayoutRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class AdminModule { }
