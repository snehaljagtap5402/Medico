import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { LayoutModule } from '@angular/cdk/layout';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    MaterialModule,
    LayoutModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    MaterialModule,
    LayoutModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
