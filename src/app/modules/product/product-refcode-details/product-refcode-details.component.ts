import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../models/product.model';
import { ProductService } from '../../../shared/services/modules/product.service';
import { ViewAddedProductComponent } from '../../cart/view-added-product/view-added-product.component';
import { MatDialog } from '@angular/material/dialog';
import { AddToCartService } from 'src/app/shared/services/modules/add-to-cart.service';
import { MetalType } from 'src/app/enum/metal-type';
import { CartItem } from '../models/cart-item';
import { ToastrService } from 'ngx-toastr';
import { CurrencyService } from 'src/app/shared/services/currency.service';
import { CategoryService } from 'src/app/shared/services/modules/category.service';
import { Category, Subcategory } from '../models/category';
import { AuthService } from 'src/app/shared/services/modules/auth.service';
import { environment } from 'src/environments/environment.development';
import { LoginComponent } from 'src/app/account/login/login.component';

@Component({
  selector: 'app-product-refcode-details',
  templateUrl: './product-refcode-details.component.html',
  styleUrls: ['./product-refcode-details.component.scss'],
})

export class ProductRefcodeDetailsComponent {
  @Input() products: Product = {} as Product;
  public selectedCurrency: any;
  public product: Product | any;
  public product1: Product = {} as Product;
  public selected = 'option1';
  public totalPrice: any;
  public cartProducts: any;
  public productId: number = 0;
  public quantity: number = 1;
  public vatRate: number = 0.5;
  public selectedAlloy: any = 'all';
  public originalTableData: any[] = [];
  public tableData: any[] = [];
  public id: any;
  public refcode: any;
  public metalTypes: any[] = [];
  public alloyId: any;
  public groupedProducts: any[] = [];
  public selectedMetalType: string = 'all';
  public userId: any = localStorage.getItem('id');
  public categories: Category[] = [];
  public selectedSubcategory: Subcategory | any;
  public selectedCategoryByCode: Category | any;
  public subcategoryCode: any;
  public groupCode: any;
  public isAuthenticated: boolean = false;
  public idAccount: any;
  public imagePathPrefix = environment.images;
  public upliftCharge: number = 0;
  currentImageIndex: number = 0;

  constructor(
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private productService: ProductService,
    private dialog: MatDialog,
    private addToCartService: AddToCartService,
    private categoryService: CategoryService,
    private _authService: AuthService,
    public currencyService: CurrencyService,
    public changeDetector: ChangeDetectorRef
  ) { }

  public ngOnInit(): void {
    this._authService.isLoggedIn().then((loggedIn) => {
      this.isAuthenticated = loggedIn;
    });
    // Retrieve idAccount from localStorage
    const idAccountStr = localStorage.getItem('idAccount');
    if (idAccountStr) {
      this.idAccount = parseInt(idAccountStr);
    }

    this.currencyService.selectedCurrency$.subscribe((currency) => {
      this.selectedCurrency = currency;
    });

    this.selectedAlloy = 'all';
    this.filterTable(this.selectedAlloy);
    this.fetchMetalTypes();

    this.route.params.subscribe(async (params) => {
      this.id = params['id'];
      this.refcode = params['refcode'];
      await this.fetchProductDetails(this.id);
      this.getCategories();
    });

    this.id = +this.route.snapshot.paramMap.get('id')!;

    const upliftChargeStr = localStorage.getItem('upliftCharge');
    this.upliftCharge = upliftChargeStr ? parseFloat(upliftChargeStr) : 0;
  }

  public openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '400px',
    });
  }

  public getCategories(): void {
    this.categoryService.getCategory().subscribe(
      (data: Category[]) => {
        this.categories = data;
        this.groupCode = this.product.groupcode;
        this.subcategoryCode = this.product.subCode;
        if (this.subcategoryCode) {
          const selectedCategory = this.categories.find(
            (cat) =>
              cat.subcategories &&
              cat.subcategories.some(
                (subcat) => subcat.subcategoryCode === this.subcategoryCode
              )
          );
          if (selectedCategory && selectedCategory.subcategories) {
            this.selectedSubcategory = selectedCategory.subcategories.find(
              (subcat) => subcat.subcategoryCode === this.subcategoryCode
            );
            this.selectedCategoryByCode = this.categories.find(
              (cat) => cat.categoryCode === this.groupCode
            );
          }
        }
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  public fetchProductDetails(id: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.productService.getProductDetails(id).subscribe(
        (product: any) => {
          this.product = product;
          const upliftAmount = this.product.sellPrice * (this.upliftCharge / 100);
          this.product.sellPrice = (this.product.sellPrice + upliftAmount).toFixed(2);
          if (this.product.images) {
            this.product.images = this.product.images;
            this.currentImageIndex = 0; 
          }
          resolve(); 
        },
        (error) => {
          console.error('Error fetching product details:', error);
          reject(error); // Reject the promise in case of an error
        }
      );
    });
  }

  public fetchMetalTypes(): void {
    this.productService.getMetalTypes().subscribe(
      (data: MetalType[]) => {
        this.metalTypes = data;
      },
      (error) => {
        console.error('Error fetching metal types', error);
      }
    );
  }

  public filterTable(selectedAlloy: string): void {
    if (selectedAlloy !== 'all') {
      this.productService
        .getProductsByAlloyId1(
          selectedAlloy,
          this.groupCode,
          this.subcategoryCode
        )
        .subscribe(
          (response: any[]) => {
            this.groupedProducts = response[0].products;
            if (this.groupedProducts && this.groupedProducts.length > 0) {
              this.groupedProducts.forEach(product => {
                const baseSellPrice = Number(product.sellPrice);

                if (!isNaN(baseSellPrice)) {
                  const upliftAmount = baseSellPrice * (this.upliftCharge / 100);
                  product.sellPrice = baseSellPrice + upliftAmount; 
                } else {
                  console.error("Invalid sellPrice for product:", product);
                  product.sellPrice = 0;
                }
              });
              //this.product = this.groupedProducts[0];
            }
          },
          (error) => {
            console.error('Error fetching products:', error);
          }
        );
    } else {
      this.productService.getAllAlloys().subscribe(
        (response: any[]) => {
          this.groupedProducts = response;
          this.groupedProducts.forEach(product => {
            const baseSellPrice = Number(product.sellPrice);
            // Check for NaN and assign a default value if necessary
            if (!isNaN(baseSellPrice)) {
              const upliftAmount = baseSellPrice * (this.upliftCharge / 100);
              product.sellPrice = baseSellPrice + upliftAmount; // Apply uplift to the current product
            } else {
              console.error("Invalid sellPrice for product:", product);
              product.sellPrice = 0; // or handle as necessary
            }
          });
          // if (
          //   this.groupedProducts &&
          //   this.groupedProducts.length > 0 &&
          //   this.groupedProducts[0].products &&
          //   this.groupedProducts[0].products.length > 0
          // ) {
          //   this.product = this.groupedProducts[0].products[0];
          // }
        },
        (error) => {
          console.error('Error fetching all alloys:', error);
        }
      );
    }
  }

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  incrementQuantity() {
    if (this.quantity < Number.MAX_SAFE_INTEGER) {
      this.quantity++;
    }
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  updateQuantity(event: any) {
    const enteredValue = event.target.value;
    const sanitizedValue = enteredValue.replace(/[^0-9]/g, '').substring(0, 3);
    const limitedValue =
      sanitizedValue === '' ? 0 : parseInt(sanitizedValue, 10);
    this.quantity = limitedValue;
    event.target.value = limitedValue.toString();
    this.quantity = limitedValue;
  }

  calculateTotalPrice(): number {
    const price = this.product.sellPrice || 0;
    this.totalPrice = this.quantity * price;
    return this.quantity * price;
  }

  // Handle the selection of ring size
  onRingSizeSelect(size: string) {
    if (this.product) {
      this.product.selectedSize = size;
    }
  }

  addToCartOrNavigate() {
    if (!this.isAuthenticated) {
      this._authService.login();
    } else {
      this.addToCart();
      // this.router.navigate(['/cart']);
    }
  }

  openLoginPopup() {
    this._authService.login();
  }

  alloyData = [
    { value: 0, label: 'Platinum' },
    { value: 1, label: 'Gold' },
    { value: 2, label: 'Silver' },
    { value: 3, label: '22 carat gold' },
    { value: 4, label: '9ct yellow gold' },
    { value: 5, label: '22ct yellow' },
    { value: 6, label: '22ct white' },
  ];

  public addToCart(): void {
    // Check if the productId is available in the product object
    if (!this.product || !(this.product.productId || this.product.id)) {
      console.error('Product ID is not available.');
      return;
    }

    // Check if either quantity or average cost is 0
    if (this.quantity <= 0 || this.product.sellPrice <= 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.toastrService.warning(
        'Product with quantity or average cost 0 cannot be added to cart'
      );
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
        this.openCartDialog();
      },
      (error) => {
        console.error('Failed to add product to cart:', error);
      }
    );
  }

  public openCartDialog(): void {
    if (this.quantity <= 0 || this.product.sellPrice <= 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.toastrService.warning(
        'Product with quantity or average cost 0 cannot be added to cart'
      );
      return;
    }

    const dialogRef = this.dialog.open(ViewAddedProductComponent, {
      width: '600px',
    });
  }

  public goToSlide(index: number): void {
    this.currentImageIndex = index;
    this.changeDetector.detectChanges();
  }

  public prevSlide(): void {
    if (this.currentImageIndex === 0) {
      // If at the first image, go to the last image
      this.currentImageIndex = this.product.images.length - 1;
    } else {
      // Otherwise, go to the previous image
      this.currentImageIndex--;
    }
    this.changeDetector.detectChanges();
  }

  public nextSlide(): void {
    if (this.currentImageIndex === this.product.images.length - 1) {
      // If at the last image, go to the first image
      this.currentImageIndex = 0;
    } else {
      // Otherwise, go to the next image
      this.currentImageIndex++;
    }
    this.changeDetector.detectChanges();
  }
}
