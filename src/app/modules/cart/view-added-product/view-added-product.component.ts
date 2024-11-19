import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-added-product',
  templateUrl: './view-added-product.component.html',
  styleUrls: ['./view-added-product.component.scss']
})
export class ViewAddedProductComponent {
  constructor(
    private router: Router,
    private dialogRef: MatDialogRef<ViewAddedProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  continueShopping() {
    this.closePopup();
  }

  viewCart() {
    // Navigate to the "View Cart" page
    this.router.navigate(['/cart']); 
    this.closePopup();
  }

  checkout() {
    // Navigate to the "Checkout" page
    this.router.navigate(['/cart/checkout']); 
    this.closePopup();
  }

  closePopup() {
    this.dialogRef.close();
  }
}
