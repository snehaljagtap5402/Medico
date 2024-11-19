import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AddToCartService } from 'src/app/shared/services/modules/add-to-cart.service';
import { OrderService } from 'src/app/shared/services/modules/order.service';
import { ProductService } from 'src/app/shared/services/modules/product.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss']
})
export class GlobalSearchComponent {
  // wishlist: Product[] = [];
  // idAccount: any;
  // userId: any = localStorage.getItem('id');
  // minPrice: number | any;
  // maxPrice: number | any;
  // subcategoryCode: any;
  // groupCode: any;
  // alloyId: any;
  // currentPage: number = 1;
  // itemsPerPage = 15;
  // pageCount = 0;
  // selectedProduct: Product | undefined;
  // addedDate: any | null = null;
  // quantity: number = 1;
  // products: any[] | any;
  // searchText: string = '';
 
  visible: boolean = false;
  screenWidth: any;
  pageSize: number = 15;
  currentPage: number = 1;
  minPrice: number | any;
  maxPrice: number | any;
  products: any[] | any;
  subcategoryCode: any;
  groupCode: any;
  alloyId: any;
  itemsPerPage = 15;
  pageCount = 0;
  // categories: Category[] = [];
  // selectedSubcategory: Subcategory | any;
  // selectedCategoryByCode: Category | any;
  stockDescriptions: string[] = [];
  selectedStockDescription: string | any;
  metalTypes: any[] = [];
  selectedProduct: Product | undefined;
  itemsPerPageOptions: number[] = [15, 30, 45];
  selectedSortOption: string = 'popular';
  addedDate: any | null = null;
  searchText: string = '';
 

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private addToCartService: AddToCartService,
    private toastrService: ToastrService,
    private router: Router,
    private dialog: MatDialog,
    private toasterService: ToastrService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchText = params['searchText'];
      this.loadProducts();
    });
  }


  loadProducts(): void {
    const minPrice = this.minPrice !== undefined ? this.minPrice : 0;
    const maxPrice = this.maxPrice !== undefined ? this.maxPrice : 0;

    const filter = {
      // AlloyId: this.alloyId,
      // GroupCode: this.groupCode,
      // SubCode: this.subcategoryCode,
      MinPrice: minPrice,
      MaxPrice: maxPrice,
      PageNumber: this.currentPage,
      PageSize: this.itemsPerPage,
      AddedDate: this.addedDate
    };
    if (this.searchText) {
      this.productService.getSearchProducts(filter, this.searchText).subscribe((data: any) => {
        //this.products = data; 
         // Assuming data.products is the array of products
         this.products = data.products;
        this.pageCount = data.pageCount;
        
        this.pageCount = data.pageCount;
        if (this.products.products.length === 1) {
          const product = this.products.products[0];
       //this.productService.setSearchText('');
        }
      });
    } else {
      this.productService.getFilteredProducts(filter).subscribe((data: any) => {
        this.products = data.products;
        this.pageCount = this.products.pageCount;
        this.selectedProduct = this.products?.products[0];
        if (this.products.products.length === 1) {
          const product = this.products.products[0];
        }       
        this.selectedProduct = this.products?.products[0];
      });
    }
  }
}
