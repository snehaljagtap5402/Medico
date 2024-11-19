import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MetalType } from 'src/app/enum/metal-type';
import { Product } from '../../product/models/product.model';
import { CurrencyService } from 'src/app/shared/services/currency.service';
import { AddToCartService } from 'src/app/shared/services/modules/add-to-cart.service';
import { CheckoutService } from 'src/app/shared/services/modules/checkout.service';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss'],
})
export class CheckOutComponent {
  @Input() products: Product = {} as Product;
  //@Input() selectedCurrency: string = 'GBP';
  public selectedCurrency: any;
  public idAccount: any;
  public productId: number = 0;
  public product: any;
  public displayedColumns: string[] = [
    'id',
    'totalprice',
    'quantity',
    'price',
    'action',
  ];
  public cartDetails: any[] = [];
  public shippingModes: any[] = [];
  public totalPrice = 0.0;
  public totalItem = 0;
  public ShippingRate: number = 0;
  public showBillingInfo: any;
  public vat = 0;
  public grandToal = 0.0;
  public selected = '1';
  public showcheckoutForm: boolean = false;
  public itemTotal = 0;
  //public userId: any = localStorage.getItem('id');
  public vatRate: any;
  public billingFormValues: any;
  public values: any;
  public billingDetails: any;
  public shippingDetails: any;
  public shippingMethodDetails: any;
  public selectedLabel: string = '';
  public selectedPaymentMethod: any;
  public selectedContact: any;
  public currencySymbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    GBP: '£', // British Pound symbol
    AUD: 'A$', // Australian Dollar symbol
    // Add more currency symbols for other currencies as needed
  };

  // Define the metalTypes array with values from the enum
  public metalTypes: string[] = Object.values(MetalType);
  addToCart: [] = [];
  public upliftCharge: number = 0; 

  constructor(
    private toastrService: ToastrService,
    private checkoutService: CheckoutService,
    private addToCartService: AddToCartService,
    private router: Router,
    private currancyService: CurrencyService
  ) {}

  ngOnInit(): void {
    // Retrieve idAccount from localStorage
    const idAccountStr = localStorage.getItem('idAccount');
    if (idAccountStr) {
      this.idAccount = parseInt(idAccountStr);
    }
    this.currancyService.selectedCurrency$.subscribe((currency) => {
      this.selectedCurrency = currency;
    });
    const upliftChargeStr = localStorage.getItem('upliftCharge');
    this.upliftCharge = upliftChargeStr ? parseFloat(upliftChargeStr) : 0;
    this.getProductFromCart();
    this.getCart();
    // this.billingDetails = this.checkoutService.billingDetails;
    // this.shippingDetails = this.checkoutService.shippingDetails;
    // this.shippingMethodDetails = this.checkoutService.shippingMethodDetails;
    this.getPriceInSelectedCurrency();

    this.getProductFromCart();
  }

  shippingOptions = [
    { value: '1', label: 'Collect from London Branch @ £0.00', price: 0.0 },
    { value: '2', label: 'Collect from Birmingham Branch @ £0.00', price: 0.0 },
    {
      value: '3',
      label: 'Royal Mail Signed For 1st Class @ £6.00',
      price: 6.0,
    },
    {
      value: '4',
      label: 'Royal Mail Special Delivery: Next Day Delivery @ £8.60',
      price: 8.6,
    },
    { value: '5', label: 'TNT: Heavy Weight Delivery @ £20.00', price: 20.0 },
  ];

  //selectedLabel: string = this.shippingOptions[0].value;

  getShippingOptions(): void {
    this.addToCartService.getAllDelModes().subscribe(
      (data) => {
        this.shippingModes = data;
        this.selectedLabel = this.shippingModes[0].name;
      },
      (error) => {
        console.error('Error fetching shipping options:', error);
      }
    );
  }

  
  getCurrencySymbol(): string {
    return this.currencySymbols[this.selectedCurrency] || '';
  }


  // Function to update price based on selectedLabel
  updatePriceBasedOnShipping(): void {
    this.addToCart.forEach((item: any) => {
      if (this.selectedLabel) {
        const selectedShippingOption = this.shippingOptions.find(
          (option) => option.value === this.selectedLabel
        );
        if (selectedShippingOption) {
          item.price = selectedShippingOption.price;
        }
      }
    });
  }

  getPriceInSelectedCurrency(): string {
    if (this.products && this.products.refcodes) {
      const selectedPrice =
        this.products.refcodes[0].prices[this.selectedCurrency];
      if (selectedPrice !== undefined) {
        return selectedPrice.toFixed(2);
      }
    }
    return 'N/A';
  }

  public onRefCodeClick(refCode: any) {
    let url = this.router.url + '/' + refCode;
    this.router.navigate([url]);
  }

  public incrementQuantity(productData: any) {
    let editAddTocartData: any[] = [];
    this.addToCartService
      .getProductFromCartById(productData.id)
      .subscribe((data: any) => {
        if (data) {
          data.quantity = productData.quantity + 1;
          data.price = parseFloat(
            (
              parseFloat(productData.price) +
              parseFloat(productData.pricePerProduct)
            ).toFixed(2)
          );
          editAddTocartData.push(data);
          if (editAddTocartData.length != 0) {
            this.addToCartService
              .editCartDetails(editAddTocartData)
              .subscribe((data: any) => {
                this.getProductFromCart();
              });
          }
        }
      });
  }

  public decrementQuantity(productData: any) {
    let editAddTocartData: any[] = [];
    this.addToCartService
      .getProductFromCartById(productData.id)
      .subscribe((data: any) => {
        if (data) {
          data.quantity = productData.quantity - 1;
          data.price = parseFloat(
            (
              parseFloat(productData.price) -
              parseFloat(productData.pricePerProduct)
            ).toFixed(2)
          );
          editAddTocartData.push(data);
          if (editAddTocartData.length != 0) {
            this.addToCartService
              .editCartDetails(editAddTocartData)
              .subscribe((data: any) => {
                this.getProductFromCart();
              });
          }
        }
      });
  }

  getCart() {
    this.addToCartService.getCartItemsByUserId(this.idAccount).subscribe(
      (data) => {
        this.cartDetails = data;
        this.cartDetails.forEach((product: any) => {
          //product.sellPrice += this.upliftCharge;
          const upliftAmount = product.sellPrice * (this.upliftCharge / 100);
          //product.sellPrice = product.sellPrice + upliftAmount;
          product.sellPrice = +(product.sellPrice + upliftAmount).toFixed(2);
          product.total = (product.quantity * product.sellPrice).toFixed(2);
        });
        this.vatRate = this.cartDetails[0].vatRate;
      },
      (error) => {
        console.error('Error fetching cart items:', error);
      }
    );
    this.getTotalOfAllItems();
  }

  onBillingFormValues(value: any) {
    this.billingDetails = value;
   
  }

  onShippingFormValues(value: any) {
    this.shippingDetails = value;
  }

  onShippingMethodFormValues(value: any) {
    this.shippingMethodDetails = value;
  }

  public getProductFromCart() {
    this.totalPrice = 0.0;
    this.totalItem = 0;
    this.grandToal = 0;
    this.itemTotal = 0;
  }

  getItemTotal(product: any): number {
    let total = 0;
    for (const item of this.cartDetails) {
      total += parseFloat(item.total);
    }
    return total;
  }

  getTotalOfAllItems(): number {
    let total = 0;
    for (const item of this.cartDetails) {
      total = item.lineItemCount;
    }
    return total;
  }

  getVAT(total: number): number {
    if (!isNaN(total)) {
      const vatDifference = total * ((100 + this.vatRate) / 100);
      const vat = vatDifference - total;
      return parseFloat(vat.toFixed(2));
    } else {
      return 0;
    }
  }

  calculateSubTotal(): number {
    let subTotal = 0;
    if (this.cartDetails) {
      for (const product of this.cartDetails) {
        //const itemTotal = this.getItemTotal(product);
        subTotal = this.getItemTotal(product);
        //subTotal += itemTotal;
      }
    }
    return subTotal;
  }

  // getTotalExcludingVAT(): number {
  //   let total = 0;
  //   // Iterate through each item in cartDetails and sum up the total
  //   for (const item of this.cartDetails) {
  //     total += parseFloat(item.total);
  //   }
  //   return parseFloat(total.toFixed(2));
  // }

  getTotalExcludingVAT(): number {
    let total = 0;
    // Iterate through each item in cartDetails and sum up the total
    for (const item of this.cartDetails) {
      total += Math.round(parseFloat(item.total) * 100); // Convert to integer for precise addition
    }
    return parseFloat((total / 100).toFixed(2)); // Convert back to decimal after addition and round to 2 decimal places
  }

  calculateGrandTotal(): number {
    const subTotal = this.calculateSubTotal();
    const vat = this.getVAT(subTotal);
    const totalExcludingVAT = this.getTotalExcludingVAT();
    const grandTotal = totalExcludingVAT + this.ShippingRate + vat;
    // Check if grandTotal is NaN, if yes, set it to 0.00
    return isNaN(grandTotal) ? 0.0 : parseFloat(grandTotal.toFixed(2));
  }

  public removeFromCart(id: any) {
    this.addToCartService.deleteCartDetails(id).subscribe((data: any) => {
      this.toastrService.error('Product removed from cart', 'Remove');
      this.getProductFromCart();
    });
  }

  public showcheckout() {
    this.showcheckoutForm = true;
  }

  public showBillingForm(data: any) {
    this.showBillingInfo = data;
  }

  onSelectedPaymentMethodChange(paymentMethod: number) {
    this.selectedPaymentMethod = paymentMethod;
  }

  onContactFormValues(value: any) {
    this.selectedContact = value;
  }
}
