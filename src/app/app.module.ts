import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from './layout/layout.module';
import { LayoutComponent } from './layout/layout.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UserComponent } from './modules/user/user.component';
import { UserModule } from './modules/user/user.module';
import { AccountComponent } from './account/account.component';
import { AccountModule } from './account/account.module'; 
import { HttpRequestInterceptor } from './shared/interceptors/http-request.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    UserComponent,
    AccountComponent,    
  ],
  imports: [
    BrowserModule,
    CommonModule,
    SharedModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    LayoutModule,
    AccountModule,
    UserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FlexLayoutModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true,
    },
    // Other services and providers
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
