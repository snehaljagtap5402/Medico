import { Component } from '@angular/core';
import { ProductService } from 'src/app/shared/services/modules/product.service';
import { Product } from '../models/product.model';
import { OrderService } from 'src/app/shared/services/modules/order.service';
import { ToastrService } from 'ngx-toastr';
import { CurrencyService } from 'src/app/shared/services/currency.service';
import { AuthService } from 'src/app/shared/services/modules/auth.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
})
export class WishlistComponent {
  public wishlist: Product[] = [];
  public idAccount: any;
  public userId: any = localStorage.getItem('id');
  public minPrice: number | any;
  public maxPrice: number | any;
  public subcategoryCode: any;
  public groupCode: any;
  public alloyId: any;
  public currentPage: number = 1;
  public itemsPerPage = 15;
  public pageCount = 0;
  public selectedProduct: Product | undefined;
  public addedDate: any | null = null;
  public quantity: number = 1;
  public products: any[] | any;
  public wishlistProducts: any[] | any;
  public searchText: string = '';
  public visible: boolean = false;
  public selectedSortOption: string = 'popular';
  public selectedCurrency: any;

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private toasterService: ToastrService,
    private currencyService: CurrencyService,
    private _authService: AuthService
  ) {}

  ngOnInit(): void {
    //this.getAccountId();
    // this._authService.idAccountAction$.subscribe(idAccount => {
    //   this.idAccount = idAccount;
    // });

    // Retrieve idAccount from localStorage
    const idAccountStr = localStorage.getItem('idAccount');
    if (idAccountStr) {
      this.idAccount = parseInt(idAccountStr);
    }
    this.currencyService.selectedCurrency$.subscribe((currency) => {
      this.selectedCurrency = currency;
      this.loadWishlist(this.idAccount);
    });
  }

  //Function to get accountId
  async getAccountId() {
    this.orderService.getAccountId(this.userId).subscribe(
      async (data: any) => {
        this.idAccount = data.idAccount;
        this.productService.searchText$.subscribe((searchText) => {
          this.searchText = searchText;
          this.loadWishlist(this.idAccount);
        });
      },
      (error: any) => {
        console.error('Error fetching idAccount:', error);
      }
    );
  }

  //Function to load wishlist
  loadWishlist(idAccount: any) {
    const filter = {
      PageNumber: this.currentPage,
      PageSize: this.itemsPerPage,
    };

    if (this.searchText) {
      this.productService.getSearchProducts(filter, this.searchText).subscribe((data: any) => {
          this.products = data;
          this.wishlistProducts = data.products;
          this.pageCount = data.totalCount;
          this.products.products.forEach((product: { sellPrice: number }) => {
          //  product.sellPrice = this.currencyService.convertCurrency(
             // product.sellPrice,
              //'GBP', // Assuming sellPrice is in USD, change it accordingly if not
             // this.selectedCurrency
            //);
          });
        });
    } else {
      this.productService.getFilteredWishlistProducts(filter, idAccount).subscribe((data: any) => {
          this.products = data;
          this.wishlistProducts = data.products;
          this.pageCount = data.totalCount;
          this.products.products.forEach((product: { sellPrice: number }) => {
            //product.sellPrice = this.currencyService.convertCurrency(
            //  product.sellPrice,
             // 'GBP', // Assuming sellPrice is in USD, change it accordingly if not
             // this.selectedCurrency
            //);
          });
        });
    }
  }

  //Function to remove items from wishlist
  removeFromWishlist(productId: string) {
    this.productService.removeProductFromWishlist(this.idAccount, productId).subscribe((response: any) => {
        this.toasterService.success('Product removed from the wishlist');
        this.loadWishlist(this.idAccount);
      });
  }

  //Function to sort items
  onSortOptionChange(): void {
    if (this.selectedSortOption === 'newest') {
      const today = new Date();
      today.setMilliseconds(0);
      this.addedDate = today.toISOString().slice(0, 23).replace('T', ' ');
    } else {
      this.addedDate = null;
    }
    this.loadWishlist(this.idAccount);
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1;
    this.loadWishlist(this.idAccount);
  }

  minMaxPriceFilter(): void {
    this.loadWishlist(this.idAccount);
  }

  get paginatedProducts(): any[] {
    return this.products?.products;
  }

  onPageChange(page: number | string): void {
    if (typeof page === 'number') {
      this.currentPage = page;
      this.loadWishlist(this.idAccount);
    }
  }

  goToFirstPage(): void {
    if (this.currentPage !== 1) {
      this.currentPage = 1;
      this.loadWishlist(this.idAccount);
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadWishlist(this.idAccount);
    }
  }

  goToNextPage(): void {
    const totalPages = this.getTotalPages();
    if (this.currentPage < totalPages && this.currentPage < this.pageCount) {
      this.currentPage++;
      this.loadWishlist(this.idAccount);
    }
  }

  goToLastPage(): void {
    const totalPages = this.getTotalPages();
    if (this.currentPage !== totalPages) {
      this.currentPage = totalPages;
      this.loadWishlist(this.idAccount);
    }
  }

  getPaginationRange(): number[] {
    const totalPages = this.getTotalPages();
    const current = this.currentPage;

    const visiblePages = 5;
    let startPage = Math.max(1, current - Math.floor(visiblePages / 2));
    let endPage = Math.min(totalPages, startPage + visiblePages - 1);

    if (totalPages > visiblePages) {
      if (endPage === totalPages) {
        startPage = Math.max(1, endPage - visiblePages + 1);
      } else if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + visiblePages - 1);
      }
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  }

  getTotalPages(): number {
    return Math.ceil(this.pageCount / this.itemsPerPage);
  }

  showHide(): void {
    this.visible = !this.visible;
  }
}
