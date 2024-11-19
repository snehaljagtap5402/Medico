import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutRoutingModule } from './layout-routing.module';
import { FooterComponent } from './footer/footer.component';
import { SharedModule } from '../shared/shared.module';
import { HeaderComponent } from './header/header.component';
import { FormsModule } from '@angular/forms';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { RecaptchaModule } from 'ng-recaptcha';
import { PrivacyComponent } from './privacy/privacy.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { InfoCenterModule } from '../modules/info-center/info-center.module';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    ContactDetailsComponent,
    PrivacyComponent,
    TermsConditionsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    LayoutRoutingModule,
    FormsModule,
    RecaptchaModule,
    InfoCenterModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent
  ]
})
export class LayoutModule { }
