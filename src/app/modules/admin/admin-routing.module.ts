import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminuserListComponent } from './adminuser-list/adminuser-list.component';
import { AddEditAdminuserComponent } from './add-edit-adminuser/add-edit-adminuser.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminChangePasswordComponent } from './admin-change-password/admin-change-password.component';
import { changePasswordGuard } from 'src/app/shared/services/modules/change-password.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    canActivate: [changePasswordGuard], 
    pathMatch: 'full'
  },
  {
    path: 'users',
    component: AdminuserListComponent,
    canActivate: [changePasswordGuard] 
  },
  {
    path: 'update-user-detail/:id',
    component: AddEditAdminuserComponent,
    canActivate: [changePasswordGuard] 
  },
  {
    path: 'add-user',
    component: AddEditAdminuserComponent,
    canActivate: [changePasswordGuard] 
  },
  {
    path: 'dashboard',
    component: AdminDashboardComponent,
    canActivate: [changePasswordGuard] 
  },
  {
    path: 'change-password',
    component: AdminChangePasswordComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
