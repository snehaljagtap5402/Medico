import { Component, Input } from '@angular/core';
import { Product } from '../models/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/shared/services/modules/product.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from 'src/app/account/login/login.component';
import { CartItem } from '../models/cart-item';
import { AddToCartService } from 'src/app/shared/services/modules/add-to-cart.service';
import { ToastrService } from 'ngx-toastr';
import { CurrencyService } from 'src/app/shared/services/currency.service';
import { AuthService } from 'src/app/shared/services/modules/auth.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent {
  @Input() categories: any[] = [];
  @Input() product: Product | any;
  public subcategoryCode: any;
  public groupCode: any;
  public idAccount: any;
  public wishlistChecked: boolean = false;
  public loadingCheckWishlist: boolean = false;
  public quantity: number = 1;
  public matchingProducts: any[] = [];
  public isAuthenticated: boolean = false;
  public selectedCurrency: string = 'GBP';
  public convertedPrice: number | null = null;
  public conversionCache: { [key: string]: number } = {};
  public imagePathPrefix = environment.images;
  public upliftCharge: number = 0;

  constructor(
    private router: Router,
    private productService: ProductService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private addToCartService: AddToCartService,
    private toastrService: ToastrService,
    public currencyService: CurrencyService,
    private _authService: AuthService
  ) { }

  public ngOnInit(): void {
    this._authService.isLoggedIn().then((loggedIn) => {
      this.isAuthenticated = loggedIn;
    });

    // Listen for currency changes
    this.currencyService.selectedCurrency$.subscribe((currency) => {
      this.selectedCurrency = currency;
      this.fetchConvertedPrice();
    });

    const upliftChargeStr = localStorage.getItem('upliftCharge');
    this.upliftCharge = upliftChargeStr ? parseFloat(upliftChargeStr) : 0;

    // Initialize price display with uplift charge in GBP by default
    //this.convertedPrice = this.product?.sellPrice + this.upliftCharge;
    this.convertedPrice = this.calculatePriceWithUplift(this.product?.sellPrice);

    // Initialize price display in GBP by default
    //this.convertedPrice = this.product?.sellPrice;

    // Retrieve idAccount from localStorage
    const idAccountStr = localStorage.getItem('idAccount');
    if (idAccountStr) {
      this.idAccount = parseInt(idAccountStr, 10);
      if (!this.wishlistChecked) {
        this.checkWishlist();
      }
    }

    this.route.params.subscribe((params) => {
      this.subcategoryCode = params['subcategoryCode'];
      this.groupCode = params['groupCode'];
    });
  }

  public fetchConvertedPrice(): void {
    // Calculate the base price with uplift charge
    //const basePriceWithUplift = this.product.sellPrice + this.upliftCharge;
    const basePriceWithUplift = this.calculatePriceWithUplift(this.product.sellPrice);

    // Check if the selected currency is not GBP
    if (this.selectedCurrency !== 'GBP') {
      // Avoid making an API call if we already have the exchange rate cached
      if (this.conversionCache[this.selectedCurrency]) {
        this.convertedPrice = basePriceWithUplift * this.conversionCache[this.selectedCurrency];
      } else {
        // Only call API if conversion is not cached
        this.currencyService
          .getExchangeRate('GBP', this.selectedCurrency, basePriceWithUplift)
          .subscribe(
            (response) => {
              // Cache the conversion rate
              this.conversionCache[this.selectedCurrency] = response.conversion_rate;
              // Apply the exchange rate to the sell price with uplift
              this.convertedPrice = basePriceWithUplift * this.conversionCache[this.selectedCurrency];
            },
            (error) => {
              console.error('Error fetching exchange rate:', error);
            }
          );
      }
    } else {
      // If currency is GBP, use the original sell price with uplift
      this.convertedPrice = basePriceWithUplift;
    }
  }

  public calculatePriceWithUplift(sellPrice: number): number {
    const upliftAmount = sellPrice * (this.upliftCharge / 100);
    const finalPrice = sellPrice + upliftAmount;
    return +finalPrice.toFixed(2);
  }
  

  public onCurrencyChange(selectedCurrency: string): void {
    this.selectedCurrency = selectedCurrency;
    this.fetchConvertedPrice(); // Re-fetch price when currency changes
  }

  public openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '400px',
    });
  }

  public async checkWishlist(): Promise<any> {
    this.loadingCheckWishlist = true;
    // Check if either productId or id is present
    if (!this.product.productId && !this.product.id) {
      return;
    }

    if (!this.idAccount) {
      //this.openLoginDialog();
      this._authService.login();
      return;
    }

    this.productService.isProductInWishlist(this.idAccount).subscribe(
      (response: any[]) => {
        let isInWishlist = false;
        for (const item of response) {
          // Check if productId or id matches
          if (
            item.productID === this.product.productId ||
            item.productID === this.product.id
          ) {
            isInWishlist = true;
          }
        }
        this.product.isWishlist = isInWishlist;
        this.wishlistChecked = true;
        this.loadingCheckWishlist = false;
      },
      (error: any) => {
        console.error('Error checking product in wishlist:', error);
      }
    );
  }

  //commented for now
  // onProductClick(
  //   stockId = this.product?.stockid,
  //   alloy = this.product?.alloyId,
  //   grpCode = this.product?.groupcode,
  //   subCateCode = this.product?.subCode
  // ) {
  //   if (this.groupCode && this.subcategoryCode) {
  //     let routeParams: any[] = [
  //       '/product-detail',
  //       stockId.trim(),
  //       alloy.trim(),
  //       grpCode.trim(),
  //       subCateCode.trim(),
  //     ];
  //     this.router.navigate(routeParams);
  //   } else if (this.product && alloy && grpCode && subCateCode) {
  //     // Use values from the product object if available
  //     let routeParams: any[] = [
  //       '/product-detail',
  //       stockId.trim(),
  //       alloy.trim(),
  //       grpCode.trim(),
  //       subCateCode.trim(),
  //     ];
  //     this.router.navigate(routeParams);
  //   } else {
  //     console.error(
  //       'Error navigating to product detail. Required parameters are undefined.'
  //     );
  //   }
  // }

  public onProductClick(
    stockId = this.product?.stockid,
    alloy = this.product?.alloyId,
    grpCode = this.product?.groupcode,
    subCateCode = this.product?.subCode
  ): any {
    if (this.groupCode && this.subcategoryCode) {
      let routeParams: any[] = [
        '/product-detail',
        stockId.trim(),
        this.product.productRef.trim(),
      ];
      this.router.navigate(routeParams);
    } else if (this.product && alloy && grpCode && subCateCode) {
      // Use values from the product object if available
      // let routeParams: any[] = [
      //   '/product-detail',
      //   stockId.trim(),
      //   alloy.trim(),
      //   grpCode.trim(),
      //   subCateCode.trim(),
      // ];
      let routeParams: any[] = [
        '/product-detail',
        stockId.trim(),
        this.product.productRef.trim(),
      ];
      this.router.navigate(routeParams);
    } else {
      console.error(
        'Error navigating to product detail. Required parameters are undefined.'
      );
    }
  }

  public addToCart(): any {
    // Check if the productId is available in the product object
    if (!this.product || !(this.product.productId || this.product.id)) {
      console.error('Product ID is not available.');
      return;
    }

    // Check if product price is greater than 0
    if (this.product.sellPrice <= 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.toastrService.warning('Product with price 0 cannot be added to cart');
      return;
    }

    // Determine which ID to use based on availability
    const productId = this.product.productId || this.product.id;

    const cartItem: CartItem = {
      productID: productId,
      quantity: this.quantity,
      cartItemId: 0,
      reference: '',
      desc: '',
      //average: 0,
      total: 0,
      cartId: 0,
      sellPrice: 0,
    };
    this.addToCartService.addProductToCart1(this.idAccount, cartItem).subscribe(
      (response) => {
        this.toastrService.success('Product added in the cart');
        //this.removeProductFromWishlist();
        //this.router.navigate(['/cart']);
        // this.router.navigateByUrl('/cart');
      },
      (error) => {
        console.error('Failed to add product to cart:', error);
      }
    );
  }

  public removeProductFromWishlist(): any {
    // Check if user is logged in
    if (!this.idAccount) {
      return;
    }
    const wishlistData = {
      AccountId: this.idAccount,
      ProductId: this.product.id,
    };

    // Call service to remove product from wishlist
    this.productService
      .removeProductFromWishlist(this.idAccount, wishlistData.ProductId)
      .subscribe(
        (response: any) => {
          this.toastrService.success('Product removed from wishlist');
          window.location.reload();
          // Alternatively, you can update the wishlist array without reloading the page
          //this.loadWishlist(this.idAccount);
        },
        (error: any) => {
          console.error('Error removing product from wishlist:', error);
        }
      );
  }

  public addToCartOrNavigate(): void {
    if (!this.isAuthenticated) {
      this._authService.login();
    } else {
      this.addToCart();
      // this.router.navigate(['/cart']);
    }
  }

  public toggleWishlist(): any {
    if (!this.isAuthenticated) {
      //this.openLoginDialog();
      this._authService.login();
      return;
    }
    // Check if the productId is available in the product object
    if (!this.product || !(this.product.productId || this.product.id)) {
      console.error('Product ID is not available.');
      return;
    }

    // Determine which ID to use based on availability
    const productId = this.product.productId || this.product.id;
    const wishlistData = {
      AccountId: this.idAccount,
      ProductId: productId,
    };

    if (this.product.isWishlist) {
      this.productService
        .removeProductFromWishlist(this.idAccount, wishlistData.ProductId)
        .subscribe(
          (response: any) => {
            this.toastrService.success('Product removed from wishlist');
            window.location.reload();
            this.product.isWishlist = false;
          },
          (error: any) => {
            console.error('Error removing product from wishlist:', error);
          }
        );
    } else {
      this.productService
        .addProductToWishlist(this.idAccount, wishlistData)
        .subscribe(
          (response: any) => {
            this.toastrService.success('Product added to wishlist');
            this.product.isWishlist = true;
          },
          (error: any) => {
            console.error('Error adding product to wishlist:', error);
          }
        );
    }
  }
}
