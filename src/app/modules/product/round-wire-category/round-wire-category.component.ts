import { Component } from '@angular/core';
import { Product } from '../models/product.model';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/shared/services/modules/product.service';
import { Category, Subcategory } from '../models/category';
import { CategoryService } from 'src/app/shared/services/modules/category.service';
import { CurrencyService } from 'src/app/shared/services/currency.service';
import { combineLatest, map } from 'rxjs';
import { IAnalysisTable } from '../models/product-analysis';

@Component({
  selector: 'app-round-wire-category',
  templateUrl: './round-wire-category.component.html',
  styleUrls: ['./round-wire-category.component.scss'],
})
export class RoundWireCategoryComponent {
  public selectedCurrency: any;
  public allProducts: { product: Product; wishlistChecked: boolean }[] = [];
  public visible: boolean = false;
  public screenWidth: any;
  public pageSize: number = 15;
  public currentPage: number = 1;
  public minPrice: number | any;
  public maxPrice: number | any;
  public products: any[] | any;
  public subcategoryCode: any;
  public groupCode: any;
  public alloyId: any;
  public itemsPerPage = 15;
  public pageCount = 0;
  public categories: Category[] = [];
  public selectedSubcategory: Subcategory | any;
  public selectedCategoryByCode: Category | any;
  public stockDescriptions: string[] = [];
  public selectedStockDescription: string | any;
  public metalTypes: any[] = [];
  public selectedProduct: any[] = [];
  public itemsPerPageOptions: number[] = [15, 30, 45];
  public selectedSortOption: string = 'popular';
  public addedDate: any | null = null;
  public searchText: string = '';
  public totalCount: any;
  selectedAnalysisEntryId: string | null = null;
  public idAccount: any;

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private currencyService: CurrencyService,
  ) { }

  ngOnInit(): void {
    this.productService.searchText$.subscribe((searchText) => {
      this.searchText = searchText;
      //this.loadProducts();
    });

   // Subscribe to currency changes
  // this.currencyService.selectedCurrency$.subscribe((currency) => {
  //   this.selectedCurrency = currency;
  //   this.loadProducts(); // Reload products with the new currency
  // });

  // const idAccountStr = localStorage.getItem('idAccount');
  //   if (idAccountStr) {
  //     this.idAccount = parseInt(idAccountStr);
  //   }

    this.screenWidth = window.innerWidth;
    if (this.screenWidth > 767) {
      this.visible = true;
    }
    this.route.params.subscribe((params) => {
      this.subcategoryCode = params['subcategoryCode'];
      this.groupCode = params['groupCode'];
      this.alloyId = params['alloyId'];
      this.searchText = params['search'];
      this.getCategories();
      this.itemsPerPage = 15;
     // this.loadProducts();
      this.fetchMetalTypes();
    });
  }

   //Function to load products
   loadProducts(): void {
    const minPrice = this.minPrice !== undefined ? this.minPrice : 0;
    const maxPrice = this.maxPrice !== undefined ? this.maxPrice : 0;

    const filter = {
      AlloyId: this.alloyId,
      GroupCode: this.groupCode,
      SubCode: this.subcategoryCode,
      MinPrice: minPrice,
      MaxPrice: maxPrice,
      PageNumber: this.currentPage,
      PageSize: this.itemsPerPage,
      AddedDate: this.addedDate,
      SelectedCurrency: this.selectedCurrency,
      SelectedAnalysisEntryId: this.selectedAnalysisEntryId,
      SortOption: this.selectedSortOption,
      idAccount: this.idAccount
    };

    if (this.searchText) {
      this.productService
        .getSearchProducts(filter, this.searchText)
        .subscribe((data: any) => {
          this.products = data;
          this.pageCount = data.pageCount;
          this.selectedProduct = this.products?.products[0];
          //this.products.products.forEach((product: { sellPrice: number }) => {
           // product.sellPrice = this.currencyService.convertCurrency(
              //product.sellPrice,
             // 'GBP', // Assuming sellPrice is in USD, change it accordingly if not
              //this.selectedCurrency
           // );
          //});
          if (this.products.products.length === 1) {
            const product = this.products.products[0];
          }
        });
    } else {
      this.productService.getFilteredProducts(filter).subscribe((data: any) => {
        this.products = data;
        this.pageCount = this.products.pageCount;
        this.selectedProduct = this.products?.products[0];
       // this.products.products.forEach((product: { sellPrice: number }) => {
          //product.sellPrice = this.currencyService.convertCurrency(
           // product.sellPrice,
            //'GBP', // Assuming sellPrice is in USD, change it accordingly if not
            //this.selectedCurrency
          //);
        //});
      });
    }
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
  
    // Update selected analysis entry id
    this.selectedAnalysisEntryId = entryId; // Ensure this value is updated based on user interaction
  
    // Load products with the selected analysis entry id
    this.loadProducts();
  }

  //Function to fetch metal types
  fetchMetalTypes() {
    if (this.searchText) {
      this.productService.getMetalTypes1(undefined, undefined, this.searchText).subscribe(
        (data) => {
          this.metalTypes = data.products || [];
          this.totalCount = data.totalCount;
        },
        (error) => {
          console.error('Error fetching metal types', error);
        }
      );
    } else {
      this.productService.getMetalTypes1(this.groupCode, this.subcategoryCode).subscribe(
        (data) => {
          this.metalTypes = data.products || [];
          this.totalCount = data.totalCount;
        },
        (error) => {
          console.error('Error fetching metal types', error);
        }
      );
    }
  }

  public onSortOptionChange(): void {
    if (this.selectedSortOption === 'newest') {
      const today = new Date();
      today.setMilliseconds(0);
      this.addedDate = today.toISOString().slice(0, 23).replace('T', ' ');
    } else {
      this.addedDate = null;
    }
    this.loadProducts();
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1;
    this.loadProducts();
  }

  minMaxPriceFilter(): void {
    this.loadProducts();
  }

  get paginatedProducts(): any[] {
    return this.products?.products;
  }

  onPageChange(page: number | string): void {
    if (typeof page === 'number') {
      this.currentPage = page;
      this.loadProducts();
    }
  }

  goToFirstPage(): void {
    if (this.currentPage !== 1) {
      this.currentPage = 1;
      this.loadProducts();
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadProducts();
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.pageCount) {
      this.currentPage++;
      this.loadProducts();
    }
  }

  goToLastPage(): void {
    const totalPages = this.getTotalPages();
    if (this.currentPage !== totalPages) {
      this.currentPage = totalPages;
      this.loadProducts();
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
    return this.products?.pageCount || 0;
  }

  showHide(): void {
    this.visible = !this.visible;
  }

  public expandView(): void {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth < 767) {
      this.showHide();
    }
  }

  //Function to get categories and subcategories
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
            this.loadProducts();
          }
        }
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  getGroupCode(metalType: any): string {
    return this.groupCode || metalType.groupcode.trim();
  }

  getSubcategoryCode(metalType: any): string {
    return this.subcategoryCode || metalType.subCode.trim();
  }
}
