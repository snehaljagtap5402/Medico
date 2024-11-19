import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { LayoutComponent } from '../layout/layout.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AuthGuard } from '../shared/services/modules/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent, 
  },
  {
    path:'signup',
    component:SignupComponent
  },
  {
    path:'',
    component:LayoutComponent
  },
  {
    path: 'changepassword',
    component: ChangePasswordComponent, canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
