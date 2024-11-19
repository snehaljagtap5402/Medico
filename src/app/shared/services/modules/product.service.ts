import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
} from '@angular/common/http';
import { BehaviorSubject, combineLatest, Observable, throwError } from 'rxjs';
import { Product } from '../../../modules/product/models/product.model';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { environment } from 'src/environments/environment.development';
import { Category } from 'src/app/modules/product/models/category';
import { Utils } from '../../utils';
import { IAnalysisTable } from 'src/app/modules/product/models/product-analysis';
import { ProductAnalysis } from 'src/app/modules/product/models/product-with-analysis';
import { IProductGroup } from 'src/app/modules/product/models/iproduct-group';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl;
  private homeUrl = environment.apiUrl + 'api/Stock/homePageProducts';
  private filterUrl = environment.apiUrl + 'api/Stock/FilterProducts';
  private wishlistFilterUrl = environment.apiUrl + 'api/Wishlist/FilteredProductsByWishlist';
  //private searchFilterUrl = environment.apiUrl + 'api/Stock/GlobalSearch';
  private productByUrl = environment.apiUrl + 'api/Stock';
  private productAnalysisUrl = environment.apiUrl + 'api/stock/analysistables';
  private productWithAnalysisUrl = environment.apiUrl + 'api/stock/productswithanalysis';

  private productsUrl = environment.apiUrl + 'api/stock/productsbycustomer';

  private productGroupsUrl = environment.apiUrl + 'api/stock/productgroups';

  private wishlistUrl = 'api/Wishlist'; // Base URL for the Wishlist API
  private wishlist$ = new BehaviorSubject<any[]>([]); // Store wishlist items
  //private productGroupsUrl = environment.apiUrl + 'api/ProductGroup/GetCategories';
  //public matchingProductsNew: Product[] = [];
  private products: Product[] = [];
  counter: number;

  private searchTextSubject = new BehaviorSubject<string>('');
  searchText$ = this.searchTextSubject.asObservable();

  setSearchText(searchText: string): void {
    this.searchTextSubject.next(searchText);
  }

  selectedAnalysisSubject = new BehaviorSubject<IAnalysisTable[]>(
    new Array<IAnalysisTable>()
  );
  selectedAnalysisAction$ = this.selectedAnalysisSubject.asObservable();

  
  productWithAnalysisStore = new BehaviorSubject<ProductAnalysis[]>(
    new Array<ProductAnalysis>()
  );

  filteredProductsSubject = new BehaviorSubject<number[]>(new Array<number>());
  filteredProductsAction$ = this.filteredProductsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;
    this.counter = 0;
  }

  groupFilterProducts: number[] = [];
  priceFilterProducts: number[] = [];
  configFilterProducts: number[] = [];
  analysisFilterProducts: number[] = [];
  mappedProductsStore = new BehaviorSubject<Product[]>(new Array<Product>());

  selectedTypesSubject = new BehaviorSubject<IProductGroup[]>(
    new Array<IProductGroup>()
  );
  selectedtypesAction$ = this.selectedTypesSubject.asObservable();

  analysis$ = this.http
    .get<IAnalysisTable[]>(this.productAnalysisUrl)
    .pipe(shareReplay(1), catchError(Utils.handleError));


    getProductWithAnalysis$ = this.http
    .get<ProductAnalysis[]>(this.productWithAnalysisUrl)
    .pipe(shareReplay(1), catchError(Utils.handleError))
    .subscribe((data) => this.productWithAnalysisStore.next(data));

    products$ = 
        this.http
          .get<Product[]>(
              this.productsUrl)
          
          .pipe(
            map((products) => {
              return products;
            }),
            catchError(Utils.handleError)
          );


    productsWithGroups$ = combineLatest([
      this.products$,
      this.filteredProductsAction$,
    ]).pipe(
      map(([products, productFilter]) => {
        if (this.mappedProductsStore.value.length === 0) {
          let prods = products.map(
            (prod) =>
              ({
                ...prod,
               // image: Constants.images.concat(prod.image.split('\\').join('/')),
              } as Product)
          );
  
          this.mappedProductsStore.next(prods);
  
          if (this.selectedTypesSubject.value.length > 0) {
            let filteredGroups = this.selectedTypesSubject.value;
            if (filteredGroups.length > 0) {
              let groupIds: string[] = [];
              let filteredProducts: number[] = [];
  
              filteredGroups?.forEach((g) => {
                if (g.isChecked) groupIds.push(g.groupId);
  
                g.subCategories?.forEach((s) => {
                  if (s.isChecked) groupIds.push(s.groupId);
                });
              });
  
              products
                .filter((p) => groupIds.includes(p.groupId))
                .forEach((prod) => filteredProducts.push(prod.id));
  
              this.groupFilterProducts = filteredProducts;
  
              prods = prods.filter((product) =>
                filteredProducts.includes(product.id)
              );
            }
          }
  
          return prods;
        } else {
          if (productFilter.length > 0)
            products = products.filter((product) =>
              productFilter.includes(product.id)
            );
          return products.map(
            (prod) =>
              ({
                ...prod,
              } as Product)
          );
        }
      }),
      shareReplay(1),
      catchError(Utils.handleError)
    );


    productGroups$ = this.http
    .get<IProductGroup[]>(this.productGroupsUrl)
    .pipe(
      map((groups) => {
        return groups
          .filter((g) => !g.isSubGroup)
          .map((group) => ({
            ...group,
            subCategories: groups
              .filter((g) => g.groupCode === group.groupCode && g.isSubGroup)
              .map((cat) => ({
                groupId: cat.groupId,
                groupCode: cat.groupCode,
                subCode: cat.subCode,
                //groupName: cat.groupName,
                //isChecked: false,
              })),
          }));
      }),
      shareReplay(1),
      catchError(Utils.handleError)
    );



    /////////////////////////////////////////ffffff


  getProductDetails(aliasId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}api/Stock/details/'${aliasId}'`);
  }

  // getProductDetails(stockId: string): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}api/Stock/spec/'${stockId}'`);
  // }


  getMetalTypes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}api/Stock/MetalType1`);
  }

  getStoneDetails(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}api/Stock/getStoneDetails`);
  }

  getMetalTypes1(groupcode?: string, subcode?: string, searchText?: string): Observable<any> {
    let params = new HttpParams();
    if (groupcode) {
      params = params.set('groupcode', groupcode);
    }
    if (subcode) {
      params = params.set('subcode', subcode);
    }
    if (searchText) {
      params = params.set('searchText', searchText);
    }

    return this.http.get<any>(environment.apiUrl + `api/Stock/MetalType`, { params: params });
  }

  getProductByStockId(stockId: string): Observable<Product> {
    return this.http.get<Product>(`${this.productByUrl}/${stockId}`);
  }

  getFilteredProducts(filter: any): Observable<any> {
    let params = new HttpParams()
      .set('AlloyId', filter.AlloyId || '')
      .set('GroupCode', filter.GroupCode || '')
      .set('SubCode', filter.SubCode || '')
      .set(
        'MinPrice',
        filter.MinPrice !== undefined ? filter.MinPrice.toString() : ''
      )
      .set(
        'MaxPrice',
        filter.MaxPrice !== undefined ? filter.MaxPrice.toString() : ''
      )
      .set(
        'PageNumber',
        filter.PageNumber !== undefined ? filter.PageNumber.toString() : ''
      )
      .set(
        'PageSize',
        filter.PageSize !== undefined ? filter.PageSize.toString() : ''
      )
     
      .set('AddedDate', filter.AddedDate || '')
      .set('SortOption', filter.SortOption || '');
  //Add the new parameter for selected analysis entry
  if (filter.SelectedAnalysisEntryId) {
   params = params.set('SelectedAnalysisEntryId', filter.SelectedAnalysisEntryId);
  }

    return this.http.get<any[]>(this.filterUrl, { params });
  }


  getSearchProducts(filter: any, searchText: any): Observable<any> {
    const params = new HttpParams()
    // .set('AlloyId', filter.AlloyId || '')
    // .set('GroupCode', filter.GroupCode || '')
    // .set('SubCode', filter.SubCode || '')
    // .set(
    //   'MinPrice',
    //   filter.MinPrice !== undefined ? filter.MinPrice.toString() : ''
    // )
    // .set(
    //   'MaxPrice',
    //   filter.MaxPrice !== undefined ? filter.MaxPrice.toString() : ''
    // )
    .set(
      'PageNumber',
      filter.PageNumber !== undefined ? filter.PageNumber.toString() : ''
    )
    .set(
      'PageSize',
      filter.PageSize !== undefined ? filter.PageSize.toString() : ''
    )
    .set('AddedDate', filter.AddedDate || '')
    .set('searchText', searchText);

  return this.http.get<any[]>(this.filterUrl, { params });
  }

  getFilteredWishlistProducts(filter: any, idAccount: any): Observable<any> {
    const params = new HttpParams()
      .set(
        'PageNumber',
        filter.PageNumber !== undefined ? filter.PageNumber.toString() : ''
      )
      .set(
        'PageSize',
        filter.PageSize !== undefined ? filter.PageSize.toString() : ''
      )
      .set('accountId', idAccount);

    return this.http.get<any[]>(this.wishlistFilterUrl, { params });
  }


  getHomePageProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.homeUrl);
  }

  getProductsByPriceRange(
    minPrice: number,
    maxPrice: number
  ): Observable<Product[]> {
    const url = `${this.apiUrl}?minPrice=${minPrice}&maxPrice=${maxPrice}`;
    return this.http.get<Product[]>(url);
  }

  getProducts1(
    groupCode: string,
    subcategoryCode: string,
    page: number,
    pageSize: number
  ): Observable<Product[]> {
    return this.http.get<any[]>(
      environment.apiUrl +
        `api/Stock/paginatedAllProducts?page=${page}&pageSize=${pageSize}&groupCode=${groupCode}&subcategoryCode=${subcategoryCode}`
    );
  }

  getProductsByAlloyId(alloyId: string): Observable<any> {
    return this.http.get<any[]>(
      environment.apiUrl + `api/Stock/MetalTypes/${alloyId}`
    );
  }

  getProductsByAlloyId1(
    alloyId: string,
    groupcode: string,
    subcode: string
  ): Observable<any> {
    return this.http.get<any[]>(
      environment.apiUrl +
        `api/Stock/MetalTypes/${alloyId}/${groupcode}/${subcode}`
    );
  }

  getAllAlloys(): Observable<any> {
    return this.http.get<any[]>(
      environment.apiUrl + `api/Stock/GetALLMetalTypes`
    );
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(
      environment.apiUrl + 'api/ProductGroup/GetCategories'
    );
  }

  getProductsByGroupAndSubcategory(
    groupCode: string,
    subcategoryCode: string
  ): Observable<Product[]> {
    return this.http.get<Product[]>(
      environment.apiUrl +
        `api/Stock?groupCode=${groupCode}&subcategoryCode=${subcategoryCode}`
    );
  }

  getProductsByGroup(groupCode: string): Observable<Product[]> {
    return this.http.get<Product[]>(
      environment.apiUrl + `api/Stock?groupCode=${groupCode}`
    );
  }

  getStockData(): Observable<any[]> {
    return this.http.get<any[]>(environment.apiUrl + 'api/Stock');
  }

  getCategorySubcategoryProducts(
    categoryCode: string,
    subcategoryCode: string,
    limit: number
  ): Observable<any[]> {
    return this.getStockData().pipe(
      map((products) =>
        products
          .filter(
            (product) =>
              product.groupcode === categoryCode &&
              product.subCode === subcategoryCode
          )
          .slice(0, limit)
      )
    );
  }

  getFilteredProductsByCategories(
    categoryCodes: string[],
    numberOfProducts: number
  ): Observable<any[]> {
    return this.getStockData().pipe(
      map((products) =>
        products
          .filter((product) => categoryCodes.includes(product.groupcode.trim()))
          .slice(-numberOfProducts)
      )
    );
  }

  // Fetch products from the API
  getProducts(): Observable<Product[]> {
    const productsUrl = `${this.apiUrl}/products`;
    return this.http.get<Product[]>(productsUrl);
  }

  getProductById(productId: number): Observable<Product | undefined> {
    // Check if products are already fetched
    if (this.products) {
      const product = this.products.find((p) => p.id === productId);
      if (product) {
        return new Observable<Product>((observer) => {
          observer.next(product);
          observer.complete();
        });
      }
    }

    // If products are not fetched or the product is not found locally, fetch all products
    return this.getProducts().pipe(
      map((products) => {
        const product = products.find((p) => p.id === productId);
        if (!this.products) {
          this.products = products; // Store products locally
        }
        return product;
      })
    );
  }

  getProductByRefcode(refcode: string): Observable<Product | undefined> {
    const productsUrl = `${this.apiUrl}/products`;
    return this.http.get<Product[]>(productsUrl).pipe(
      map((products) => {
        return products.find((product) =>
          product.refcodes.some((rc) => rc.refcode === refcode)
        );
      })
    );
  }

  getSimliarData(): Observable<any> {
    const alloysData = `${this.apiUrl}/products`;
    return this.http.get<any>(alloysData);
  }

  printPage(url: string): void {
    const newWindow = window.open(url);
    if (newWindow) {
      newWindow.onload = () => {
        newWindow.print();
      };
    } else {
      console.error('Failed to open a new window.');
    }
  }

  private printDataSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  public printData$: Observable<any> = this.printDataSubject.asObservable();

  setPrintData(data: any) {
    this.printDataSubject.next(data);
  }

  removeProductFromWishlist(accountId: number, productId: string): any {
    const url = `${this.apiUrl}api/Wishlist/DeleteProductFromWishlist/${accountId}/${productId}`;
    return this.http.delete(url);
  }

  addProductToWishlist(accountId: number, formData: any): any {
    return this.http.post(
      this.apiUrl + `api/Wishlist/AddProductToWishlist/${accountId}`,
      formData
    );
  }

  isProductInWishlist(accountId: any): any {
    const url = `${this.apiUrl}api/Wishlist/GetWishlistByAccountId/${accountId}`;
    return this.http.get(url);
  }

  // isProductInWishlist(): any {
  //   const url = `${this.apiUrl}api/Wishlist/GetWishlist`;
  //   return this.http.get(url);
  // }

  // Fetch wishlist for the logged-in account and update the BehaviorSubject
  public getWishlist(accountId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}api/Wishlist/GetWishlistByAccountId/${accountId}`)
      .pipe(
        map((wishlist) => {
          this.wishlist$.next(wishlist); // Store fetched wishlist
          return wishlist;
        })
      );
  }

  // Getter to access the stored wishlist as an observable
  public getWishlistItems(): Observable<any[]> {
    return this.wishlist$.asObservable();
  }


}
