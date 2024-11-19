import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IndividualConfig, ToastrService } from 'ngx-toastr';
import { MetalType } from 'src/app/enum/metal-type';
import { Product } from '../../product/models/product.model';
import { CurrencyService } from 'src/app/shared/services/currency.service';
import { AddToCartService } from 'src/app/shared/services/modules/add-to-cart.service';
import { AuthService } from 'src/app/shared/services/modules/auth.service';

@Component({
  selector: 'app-cart-info',
  templateUrl: './cart-info.component.html',
  styleUrls: ['./cart-info.component.scss'],
})
export class CartInfoComponent {
  @Input() products: Product = {} as Product;
  selectedCurrency: any;
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
  public totalPrice = 0.0;
  public totalItem = 0;
  public ShippingRate: number = 0;
  // @Input() ShippingRate: number = 0;
  public vat = 0;
  public grandToal = 0.0;
  public selected = '1';
  public showcheckoutForm: boolean = false;
  public itemTotal = 0;
  public vatRate: any;
  public idAccount: any;
  public showBillingInfo: any;
  public upliftCharge: number = 0; 

  // Define the metalTypes array with values from the enum
  public metalTypes: string[] = Object.values(MetalType);
  addToCart: [] = [];

  constructor(
    private toastrService: ToastrService,
    private addToCartService: AddToCartService,
    public currencyService: CurrencyService
  ) {}

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

  public currencySymbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    GBP: '£', // British Pound symbol
    AUD: 'A$', // Australian Dollar symbol
    // Add more currency symbols for other currencies as needed
  };

  selectedLabel: string = this.shippingOptions[0].value;
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

  ngOnInit(): void {
    // Retrieve idAccount from localStorage
    const idAccountStr = localStorage.getItem('idAccount');
    if (idAccountStr) {
      this.idAccount = parseInt(idAccountStr);
    }
    this.currencyService.selectedCurrency$.subscribe((currency) => {
      this.selectedCurrency = currency;
    });

    const upliftChargeStr = localStorage.getItem('upliftCharge');
    this.upliftCharge = upliftChargeStr ? parseFloat(upliftChargeStr) : 0;

    this.getCart();
    this.getProductFromCart();
    this.getPriceInSelectedCurrency();
  }

  refreshCartDetails() {
    this.getCart();
  }

  getCart() {
    this.addToCartService.getCartItemsByUserId(this.idAccount).subscribe(
      (data) => {
        this.cartDetails = data;
        this.cartDetails.forEach((product: any) => {
          //product.sellPrice += this.upliftCharge;
          const upliftAmount = product.sellPrice * (this.upliftCharge / 100);
          //.sellPrice = product.sellPrice + upliftAmount;
          product.sellPrice = +(product.sellPrice + upliftAmount).toFixed(2);
          product.total = (product.quantity * product.sellPrice).toFixed(2);
        });
        if (this.cartDetails.length > 0) {
          this.vatRate = this.cartDetails[0].vatRate;
          this.getTotalOfAllItems();
        }
      },
      (error) => {
        console.error('Error fetching cart items:', error);
      }
    );
    this.getTotalOfAllItems();
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

  public removeFromCart(id: any) {
    this.addToCartService.deleteCartDetails(id).subscribe((data: any) => {
      const toastrConfig = {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center',
        closeButton: true,
        enableHtml: true,
        tapToDismiss: true,
        newestOnTop: true,
        extendedTimeOut: 0,
        progressAnimation: 'decreasing',
        easeTime: 500,
        animate: 'zoomOutUp',
      } as Partial<IndividualConfig<any>>;

      // @ts-ignore
      toastrConfig.enableDuplicates = false;

      this.toastrService.error(
        'Product removed from cart',
        'Remove',
        toastrConfig
      );

      setTimeout(() => {
        window.location.reload();
      }, 3000);
      this.getProductFromCart();
    });
  }

  public showcheckout() {
    this.showcheckoutForm = true;
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
        subTotal = this.getItemTotal(product);
      }
    }
    return subTotal;
  }

  getTotalExcludingVAT(): number {
    let total = 0;
    for (const item of this.cartDetails) {
      total += Math.round(parseFloat(item.total) * 100); 
    }
    return parseFloat((total / 100).toFixed(2)); 
  }
  

  calculateGrandTotal(): number {
    const subTotal = this.calculateSubTotal();
    const vat = this.getVAT(subTotal);
    const totalExcludingVAT = this.getTotalExcludingVAT();
    const grandTotal = totalExcludingVAT + this.ShippingRate + vat;
    return isNaN(grandTotal) ? 0.0 : parseFloat(grandTotal.toFixed(2));
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
            this.refreshCartDetails();
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
            this.refreshCartDetails();
          }
        }
      });
  }

  getCurrencySymbol(): string {
    return this.currencySymbols[this.selectedCurrency] || '';
  }

  public showBillingForm(data: any) {
    this.showBillingInfo = data;
  }
}
