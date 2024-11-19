import { Component, Input } from '@angular/core';
import { ProductService } from '../../../shared/services/modules/product.service';
import { Product } from '../models/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from 'src/app/shared/services/modules/category.service';
import { Category, Subcategory } from '../models/category';
import { CurrencyService } from 'src/app/shared/services/currency.service';
import { IAnalysisTable } from '../models/product-analysis';
import { combineLatest, map } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent {
  @Input() products: Product = {} as Product;
  //@Input() selectedCurrency: string = 'GBP';
  public selectedCurrency: any;
  public productId: number = 0;
  public product: Product = {} as Product;
  public displayedColumns: string[] = ['refcode', 'description', 'prices'];
  public metalTypes: any[] = [];
  public metalTypes1: any[] = [];
  public selectedMetalType: string = 'all';
  public groupedProducts: any[] = [];
  public selectedAlloy: any = 'all';
  public tableData: any[] = [];
  public originalTableData: any[] = [];
  public entryId: any;
  public id: any;
  public stockId: any;
  public refcode: any;
  public stockDescription: string | any;
  public userId: any = localStorage.getItem('id');
  public categories: Category[] = [];
  public selectedSubcategory: Subcategory | any;
  public selectedCategoryByCode: Category | any;
  public subcategoryCode: any;
  public groupCode: any;
  public searchText: string = '';
  public totalCount: any;
  public imagePathPrefix = environment.images;
  public currentImageIndex: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    public currencyService: CurrencyService
  ) {
    this.route.params.subscribe((params) => {
      this.entryId = params['entryId'];
      this.id = params['id'];
      this.stockId = params['stockId'];
      this.refcode = params['refcode'];
      this.groupCode = params['groupCode'];
      this.subcategoryCode = params['subcategoryCode'];
    });
  }

  ngOnInit(): void {
    this.currencyService.selectedCurrency$.subscribe((currency) => {
      this.selectedCurrency = currency;
    });
    this.route.params.subscribe((params) => {
      this.selectedAlloy = params['entryId'] || 'all';
      this.selectedMetalType = this.selectedAlloy;
      this.fetchMetalTypes();
      this.filterTable(this.selectedMetalType);
      this.stockId = params['stockId'];
      this.getProductByStockId(this.id);
      this.getCategories();
    });
  }


    // #region helper methods
    getMatchingValues(
      groups: number[],
      config: number[],
      analysis: number[],
      price: number[]
    ): number[] {
      let matchingValues: number[] = [];
  
      if (groups?.length > 0) {
        if (config?.length === 0 && analysis?.length === 0 && price?.length === 0)
          return groups;
  
        groups
          .filter((c) => (config?.length > 0 ? config.includes(c) : groups))
          .filter((c) => (analysis?.length > 0 ? analysis.includes(c) : groups))
          .filter((c) => (price?.length > 0 ? price.includes(c) : groups))
          .forEach((g) => matchingValues.push(g));
  
        return matchingValues;
      } else if (config?.length > 0) {
        if (groups?.length === 0 && analysis?.length === 0 && price?.length === 0)
          return config;
  
        config
          .filter((c) => (groups?.length > 0 ? groups.includes(c) : config))
          .filter((c) => (analysis?.length > 0 ? analysis.includes(c) : config))
          .filter((c) => (price?.length > 0 ? price.includes(c) : config))
          .forEach((g) => matchingValues.push(g));
  
        return matchingValues;
      } else if (analysis?.length > 0) {
        if (groups?.length === 0 && config?.length === 0 && price?.length === 0)
          return analysis;
  
        analysis
          .filter((c) => (groups?.length > 0 ? groups.includes(c) : analysis))
          .filter((c) => (config?.length > 0 ? config.includes(c) : analysis))
          .filter((c) => (price?.length > 0 ? price.includes(c) : analysis))
          .forEach((g) => matchingValues.push(g));
  
        return matchingValues;
      } else if (price?.length > 0) {
        if (
          groups?.length === 0 &&
          analysis?.length === 0 &&
          config?.length === 0
        )
          return config;
  
        price
          .filter((c) => (groups?.length > 0 ? groups.includes(c) : price))
          .filter((c) => (analysis?.length > 0 ? analysis.includes(c) : price))
          .filter((c) => (config?.length > 0 ? config.includes(c) : price))
          .forEach((g) => matchingValues.push(g));
  
        return matchingValues;
      }
      return matchingValues;
    }
  
    selectedAnalysis$ = this.productService.selectedAnalysisAction$;
    analysisTables$ = combineLatest([
      this.productService.analysis$,
      this.productService.selectedAnalysisAction$,
    ]).pipe(
      map(([analysis, tables]) =>
        analysis.map(
          (analysis) =>
          ({
            ...analysis,
            isCollapsed:
              tables.find((item) => item.tableId === analysis.tableId)
                ?.isCollapsed ?? true,
            isChecked:
              tables.find((item) => item.tableId === analysis.tableId)
                ?.isChecked ?? false,
          } as IAnalysisTable)
        )
      )
    );
  
  
    analysisTableSelected(table: IAnalysisTable, checked: boolean) {
      let productList = this.productService.productWithAnalysisStore.value;
      let filteredProducts: number[] = [];
      let tableIds: string[] = [];
      let entryIds: string[] = [];
  
      let analysis = this.productService.selectedAnalysisSubject.value;
  
      if (
        !checked &&
        analysis?.length > 0 &&
        !Boolean(analysis?.find((a) => a.tableId === table.tableId))
      )
        return;
  
      if (analysis?.length > 0)
        analysis
          ?.find((a) => a.tableId === table.tableId)
          ?.entries?.forEach((e) => (e.isChecked = false));
  
      analysis = analysis?.filter((a) => a.tableId !== table.tableId);
  
      if (checked) {
        table.entries.forEach((e) => (e.isChecked = true));
        table.isChecked = true;
  
        analysis.push(table);
      }
  
      analysis?.forEach((a) => {
        if (a.isChecked) tableIds.push(a.tableId);
  
        a.entries?.forEach((e) => {
          if (e.isChecked && e.entryId) entryIds.push(e.entryId);  // Add check for e.entryId
        });
      });
  
      if (tableIds.length > 0 || entryIds.length > 0)
        productList
          .filter((product: { analysisTableId: string | string[]; analysisEntryId: string | string[]; }) =>
            tableIds.length > 0
              ? tableIds.some((table) =>
                product.analysisTableId?.includes(table)
              ) &&
              entryIds?.some((entry) =>
                product.analysisEntryId?.includes(entry)
              )
              : entryIds?.some((entry) =>
                product.analysisEntryId?.includes(entry)
              )
          )
          .forEach((prod: { id: number; }) => filteredProducts.push(prod.id));
  
      let globalFilter =
        this.getMatchingValues(
          this.productService.groupFilterProducts,
          this.productService.configFilterProducts,
          filteredProducts,
          this.productService.priceFilterProducts
        ) ?? new Array<number>();
  
      if (entryIds.length > 0 && globalFilter?.length == 0) globalFilter.push(-1);
  
      this.productService.analysisFilterProducts = filteredProducts;
      this.productService.filteredProductsSubject.next(globalFilter);
      this.productService.selectedAnalysisSubject.next(analysis);
    }
  
    analysisEntrySelected(table: IAnalysisTable, entryId: string) {
      // Log entryId to check its value
  
      if (!entryId) {
          console.error('Invalid Entry ID:', entryId);
          return; // Exit the function if entryId is invalid
      }
      let productList = this.productService.productWithAnalysisStore.value;
      let filteredProducts: number[] = [];
      let tableIds: string[] = [];
      let entryIds: string[] = [];
    
      let analysis = this.productService.selectedAnalysisSubject.value;
    
      // Filter out the current table from the analysis
      analysis = analysis.filter((c) => c.tableId !== table.tableId);
    
      // Find the entry and ensure its isChecked property is updated if necessary
    let selectedEntry = table.entries.find((e) => e.entryId === entryId);
    if (selectedEntry) {
      // Optionally perform any additional logic with selectedEntry
    }
  
    // Update table's isChecked status based on entries
    table.isChecked = table.entries.length === table.entries.filter((e) => e.isChecked).length;
  
    // Add table back to analysis if any entry is selected
    if (table.entries.some((e) => e.entryId === entryId)) {
      analysis.push(table);
    }
    
      // Collect tableIds and entryIds based on the updated analysis
      analysis.forEach((t) => {
        if (t.isChecked) tableIds.push(t.tableId);
    
        t.entries?.forEach((e) => {
          if (e.entryId) entryIds.push(e.entryId); // Ensure entryId is defined
        });
      });
    
      // Filter products based on analysis
      productList
        .filter((product: { analysisTableId: string | string[]; analysisEntryId: string | string[]; }) =>
          tableIds.length > 0
            ? tableIds.some((table) => product.analysisTableId?.includes(table)) &&
              entryIds.some((entry) => product.analysisEntryId?.includes(entry))
            : entryIds.some((entry) => product.analysisEntryId?.includes(entry))
        )
        .forEach((prod: { id: number; }) => filteredProducts.push(prod.id));
    
      // Apply global filtering
      let globalFilter =
        this.getMatchingValues(
          this.productService.groupFilterProducts,
          this.productService.configFilterProducts,
          filteredProducts,
          this.productService.priceFilterProducts
        ) ?? new Array<number>();
    
      // Special case for empty global filter
      if (entryIds.length > 0 && globalFilter?.length === 0) {
        globalFilter.push(-1);
      }
    
      // Update service properties
      this.productService.analysisFilterProducts = filteredProducts;
      this.productService.filteredProductsSubject.next(globalFilter);
      this.productService.selectedAnalysisSubject.next(analysis);
    }


  fetchMetalTypes() {
    if (this.searchText) {
      this.productService.getMetalTypes1(undefined, undefined, this.searchText).subscribe(
          (data) => {
            this.metalTypes1 = data.products || [];
            this.totalCount = data.totalCount;
          },
          (error) => {
            console.error('Error fetching metal types', error);
          }
        );
    } else {
      this.productService.getMetalTypes1(this.groupCode.trim(), this.subcategoryCode.trim()).subscribe(
          (data) => {
            this.metalTypes1 = data.products || [];
            this.totalCount = data.totalCount;
          },
          (error) => {
            console.error('Error fetching metal types', error);
          }
        );
    }
  }

  getCategories(): void {
    this.categoryService.getCategory().subscribe(
      (data: Category[]) => {
        this.categories = data;
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

  getProductByStockId(id: string) {
    // Call the service method to fetch the product using stockId
    this.productService.getProductDetails(id).subscribe(
      (response: any) => {
        this.product = response;
        // Assign the image URL based on response
        if (this.product.imagePath && this.product.imagePath.trim()) {
          this.product.imagePath = this.imagePathPrefix + this.product.imagePath.trim();
        } else {
          this.product.imagePath = '/assets/images/product-images/no-img.jpg'; // Fallback if no image is available
        }
        // if (this.product.imageCollection && this.product.imageCollection.length > 6) {
        //   this.product.imageCollection = this.product.imageCollection.slice(0, 6);
        // }
      },
      (error) => {
        console.error('Error fetching product:', error);
      }
    );
  }
  
  filterTable(selectedAlloy: string) {
    if (selectedAlloy !== 'all') {
      this.productService.getProductsByAlloyId1( selectedAlloy, this.groupCode.trim(), this.subcategoryCode.trim())
        .subscribe(
          (response: any[]) => {
            this.groupedProducts = response[0].products;
            if (this.groupedProducts.length > 0) {
              this.product = this.groupedProducts[0];
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
          if (
            this.groupedProducts.length > 0 &&
            this.groupedProducts[0].products.length > 0
          ) {
            this.product = this.groupedProducts[0].products[0];
          }
        },
        (error) => {
          console.error('Error fetching all alloys:', error);
        }
      );
    }
  }
  selectedProduct: any;

  
  // // Go to a specific slide
  // public goToSlide(index: number): void {
  //   this.currentImageIndex = index;
  // }

  // // Navigate to the previous slide (looping)
  // public prevSlide(): void {
  //   if (this.currentImageIndex === 0) {
  //     this.currentImageIndex = this.product.imageCollection.length - 1; // Go to the last image
  //   } else {
  //     this.currentImageIndex--;
  //   }
  // }

  // // Navigate to the next slide (looping)
  // public nextSlide(): void {
  //   if (this.currentImageIndex === this.product.images.length - 1) {
  //     this.currentImageIndex = 0; // Go to the first image
  //   } else {
  //     this.currentImageIndex++;
  //   }
  // }
}
