import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { SigninRedirectCallbackComponent } from './shared/services/signin-redirect-callback.component';
import { SignoutRedirectCallbackComponent } from './shared/services/signout-redirect-callback.component';

const routes: Routes = [
  // { path: '', component: LayoutComponent, pathMatch: 'full' },
  {
    path: '',
    component: LayoutComponent,
    loadChildren: () => import('./layout/layout.module').then((x) => x.LayoutModule),
  },
  { path: 'signin-callback', component: SigninRedirectCallbackComponent },
  { path: 'signout-callback', component: SignoutRedirectCallbackComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
