import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MetalType } from 'src/app/enum/metal-type';
import { Product } from '../../product/models/product.model';
import { CurrencyService } from 'src/app/shared/services/currency.service';
import { AddToCartService } from 'src/app/shared/services/modules/add-to-cart.service';
import { CountryService, GetCountriesResult } from 'src/app/shared/services/country.service';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent {
 // @Input() products: Product = {} as Product;
  @Input() productId: number = 0;
 // @Input() product: any;
  @Input() displayedColumns: string[] = ['id', 'totalprice', 'quantity', 'price', 'action'];
  @Input() totalPrice = 0.0;
  @Input() totalItem = 0;
  @Input() ShippingRate: number = 0;
  @Input() vat = 323.02;
  @Input() grandToal = 0.0;
  @Input() selected = '1';
  @Output() incrementQuantityEvent = new EventEmitter<any>();
  @Output() decrementQuantityEvent = new EventEmitter<any>();
  @Output() removeFromCartEvent = new EventEmitter<any>();
  @Output() showcheckoutFormEvent = new EventEmitter<any>();
  @Output() quantityUpdated = new EventEmitter<any>();
  public countries: GetCountriesResult[] = [];
  public selectedCountry: number | undefined;
  public userId: any = localStorage.getItem('id');
  public shippingModes: any[] = [];
  public selectedLabel: string = '';
  // Define the metalTypes array with values from the enum
  public metalTypes: string[] = Object.values(MetalType);
  public idAccount: any;
  public isLoading: boolean = false;
  public cartDetails: any[] = [];
  public imagePathPrefix = environment.images;
  public selectedCurrency: any;
  public upliftCharge: number = 0; 

  constructor(
    private countryService: CountryService,
    private addToCartService: AddToCartService,
    public currancyService: CurrencyService,
    private toasterService: ToastrService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    const idAccountStr = localStorage.getItem('idAccount');
    if (idAccountStr) {
      this.idAccount = parseInt(idAccountStr);
      //this.getCart();
    }

    this.currancyService.selectedCurrency$.subscribe((currency) => {
      this.selectedCurrency = currency;
      this.getCart(); 
    });

    const upliftChargeStr = localStorage.getItem('upliftCharge');
    this.upliftCharge = upliftChargeStr ? parseFloat(upliftChargeStr) : 0;
    this.getCountries();
    this.getShippingOptions();
  }

  public getCart(): void {
    this.loadingService.show();
    this.addToCartService.getCartItemsByUserId(this.idAccount).subscribe(
      (data) => {
        this.cartDetails = data;

        this.cartDetails.forEach((product: any) => {
          //product.sellPrice += this.upliftCharge;
          const upliftAmount = product.sellPrice * (this.upliftCharge / 100);
          product.sellPrice = +(product.sellPrice + upliftAmount).toFixed(2);
          product.total = (product.quantity * product.sellPrice).toFixed(2);
        });
        this.loadingService.hide(); 
      },
      (error) => {
        console.error('Error fetching cart items:', error);
        this.loadingService.hide();
      }
    );
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

  updatePriceBasedOnShipping(): void {
    this.cartDetails.forEach((item: any) => {
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

  public updateTotal(product: any): void {
   product.total = (product.quantity * product.sellPrice).toFixed(2);
  }

  getCountries() {
    this.countryService.getCountries().subscribe(
      (data) => {
        this.countries = data;
        if (this.countries.length > 0) {
          this.selectedCountry = this.countries[0].id;
        }
      },
      (error) => {
        console.error('Error fetching countries:', error);
      }
    );
  }

  public removeFromCart(id: any) {
    this.removeFromCartEvent.emit(id);
  }

  removeProductFromCart(idAccount: number, cartItemId: number): void {
    this.addToCartService
      .removeProductFromCart(this.idAccount, cartItemId)
      .subscribe(
        (response) => {
          window.location.reload();
          //this.router.navigate(['/cart'], { queryParams: { reload: true } });
          this.getCart();

          this.toasterService.error('Product removed from the cart');
        },
        (error) => {
          this.toasterService.error('Failed to remove product from the cart');
        }
      );
  }

  public showcheckoutForm() {
    this.showcheckoutFormEvent.emit();
  }

  incrementQuantity(product: any) {
    if (product.quantity < Number.MAX_SAFE_INTEGER) {
      product.quantity++;
      this.updateQuantityOnServer(product);
    }
    this.updateTotal(product);
  }

  decrementQuantity(product: any) {
    if (product.quantity > 1) {
      product.quantity--;
      this.updateQuantityOnServer(product);
    }
    this.updateTotal(product);
  }

  updateQuantityOnServer(product: any) {
    // Make the API call to update quantity on the server
    this.addToCartService
      .updateCartItemQuantity(product.cartItemId, product.quantity)
      .subscribe(
        (newQuantity) => {
          this.quantityUpdated.emit();
        },
        (error) => {
          console.error('Error updating quantity on the server:', error);
        }
      );
  }

  updateQuantity(event: any, product: any) {
    // Check if the key pressed is Enter (key code 13)
    if (event.key === 'Enter') {
      const enteredValue = event.target.value;

      // Use a regular expression to match only up to three digits
      const sanitizedValue = enteredValue
        .replace(/[^0-9]/g, '')
        .substring(0, 3);

      // Ensure the entered value is greater than or equal to 1 and less than or equal to 999
      const limitedValue = Math.min(
        999,
        Math.max(1, Math.round(Number(sanitizedValue)))
      );

      // Capture the entered value without modifying the input field directly
      event.target.value = limitedValue.toString();

      // Update the quantity
      product.quantity = limitedValue;

      // Find the index of the updated product in the cartDetails array
      const index = this.cartDetails.findIndex(
        (item) => item.id === product.id
      );

      // Update the product in the array
      if (index !== -1) {
        this.cartDetails[index] = { ...product };
      }

      // Update the total price for the product
      this.updateTotal(product);

      // Call the function to update quantity on the server
      this.updateQuantityOnServer(product);
    } else {
      // If a key other than Enter is pressed, prevent entering more than 3 digits
      const enteredValue = event.target.value;
      const sanitizedValue = enteredValue
        .replace(/[^0-9]/g, '')
        .substring(0, 3);
      event.target.value = sanitizedValue;
    }
  }
}
