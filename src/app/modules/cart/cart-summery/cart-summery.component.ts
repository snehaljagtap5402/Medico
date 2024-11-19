import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AddToCartService } from 'src/app/shared/services/modules/add-to-cart.service';
import { CheckoutService } from 'src/app/shared/services/modules/checkout.service';

@Component({
  selector: 'app-cart-summery',
  templateUrl: './cart-summery.component.html',
  styleUrls: ['./cart-summery.component.scss'],
})
export class CartSummeryComponent {
  @Input() vat: number = 0;
  @Input() vatRate: number = 0;
  @Input() ShippingRate: number = 0;
  @Input() totalOfAllItems: number = 0;
  @Input() grandTotal: number = 0;
  @Input() getCurrencySymbol: any;
  @Input() showBillingInfo: 0 | any;
  @Input() totalPrice = 0.0;
  @Input() totalItem = 0;
  @Input() grandToal: any;
  @Input() totalExcludingVAT: any = 0;
  @Input() billingDetails: any;
  @Input() shippingDetails: any;
  @Input() shippingMethodDetails: any;
  @Input() areCardsVisible: boolean = true;
  @Output() showcheckoutFormEvent = new EventEmitter<any>();
  @Input() selectedPaymentMethod: any;
  @Input() selectedContact: any;
  public productId: number = 0;
  public product: any;
  public displayedColumns: string[] = ['id', 'totalprice', 'quantity', 'price', 'action'];
  public cartDetails: any;
  public selected = '1';
  public hideButtons: boolean;
  public checkoutButtonClicked = false;
  public contactDetail: any;
  public cartId: any;
  public isDataLoaded: boolean = false;
  public isCartPage: boolean | any;
  public idAccount: any;

  constructor(
    private router: Router,
    private checkoutService: CheckoutService,
    private addToCartService: AddToCartService,
    private location: Location
  ) {
    this.checkoutButtonClicked = false;
    this.hideButtons = this.router.url.includes('checkout');
    this.isCartPage = this.router.url.includes('checkout');
  }

  ngOnInit(): void {
    // Retrieve idAccount from localStorage
    const idAccountStr = localStorage.getItem('idAccount');
    if (idAccountStr) {
      this.idAccount = parseInt(idAccountStr);
    }
    this.getCart();
  }

  navigateToCart() {
    this.router.navigate(['/cart/checkout']);
  }

  getCart() {
    this.addToCartService.getCartItemsByUserId(this.idAccount).subscribe(
      (data) => {
        this.cartDetails = data;
        // Check if cartDetails is defined and contains at least one item
        if (this.cartDetails && this.cartDetails.length > 0) {
          this.cartId = this.cartDetails[0].cartId;
        }
        //this.cartId = this.cartDetails[0].cartId;
      },
      (error) => {
        console.error('Error fetching cart items:', error);
      }
    );
  }

  emptyCart(): void {
    this.addToCartService.emptyCart(this.idAccount, this.cartId).subscribe(
      (response: any) => {
        // Reload the current route (refresh the page)
        this.location.replaceState(this.location.path());
        window.location.reload();
      },
      (error) => {
        console.error('Error emptying the cart:', error);
        // Handle errors or show appropriate messages to the user
      }
    );
  }

  calculateSubTotalExcludingVAT(): string {
    // Calculate Sub Total (ex. VAT) by subtracting VAT from total excluding VAT
    const subTotalExcludingVAT = this.totalExcludingVAT - this.vat;
    // Limit the number of digits after the decimal point to 2
    return subTotalExcludingVAT.toFixed(2);
  }

  getTotalItemQuantity(): number {
    if (!this.cartDetails) return 0;
    return this.cartDetails.reduce(
      (total: number, item: any) => total + item.quantity,
      0
    );
  }

  getPaymentMethodName(value: any): string {
    switch (value) {
      case 1:
        return 'Pay via your Euro Findings credit account';
      case 2:
        return 'Pay on collection';
      case 3:
        return 'Pay via phone';
      default:
        return 'Unknown Payment Method';
    }
  }
}
