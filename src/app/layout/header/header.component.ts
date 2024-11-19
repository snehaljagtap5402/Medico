import { Component, OnInit, ViewChild, ElementRef, HostListener, ChangeDetectorRef, } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ProductService } from 'src/app/shared/services/modules/product.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LoginComponent } from 'src/app/account/login/login.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { InfoComponent } from 'src/app/modules/info-center/info/info.component';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { CurrencyService } from 'src/app/shared/services/currency.service';
import { Category, Subcategory } from 'src/app/modules/product/models/category';
import { CategoryService } from 'src/app/shared/services/modules/category.service';
import { AuthService } from 'src/app/shared/services/modules/auth.service';
import { AddToCartService } from 'src/app/shared/services/modules/add-to-cart.service';
import { Product } from 'src/app/modules/product/models/product.model';
import { combineLatest, map, Subscription } from 'rxjs';
import { IProductGroup, IProductSubGroup } from 'src/app/modules/product/models/iproduct-group';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('stickyMenu') menuElement!: ElementRef;
  @ViewChild('siteContent') siteContent!: ElementRef;
  public originalContent = '';
  public sticky: boolean = false;
  public elementPosition: any;
  public categories: Category[] = [];
  public products: any[] | any;
  public searchProducts: any[] | any;
  public cartItemCount: number = 0;
  public userId: any = localStorage.getItem('id');
  public currentPage: number = 1;
  public itemsPerPage = 15;
  public pageCount = 0;
  public searchText: string = '';
  public selectedProduct: Product | undefined;
  public isAuthenticated: boolean = false;
  public viewMode: 'mobile' | 'desktop' = 'desktop'; // Variable to control the visibility of the menu title
  public selectedCurrency: string = 'GBP';
  public currencyFlags: { [key: string]: string } = {
    GBP: '<img src="assets/images/flag-img.jpg" alt="GBP Flag" />',
    USD: '<img src="assets/images/united-states-of-america.png" alt="UD Flag"/>',
    EUR: '<img src="assets/images/european-union.png" alt="EUR Flag" />',
    AUD: '<img src="assets/images/australia.png" alt="AUD Flag" />',
    //Add the png image for currency CHF i.e for swizerland
    CHF: '<img src="assets/images/australia.png" alt="AUD Flag" />',
  };
  public selectedCurrencyFlag: SafeHtml;
  public currencies: any[] = [];
  public isLoggedIn = false;
  public idAccount: any;
  public amount: number = 0;
  public fromCurrency: string = '';
  public toCurrency: string = '';
  public convertedAmount: number = 0;
  private currencySubscription: Subscription | any;
  public isAdmin: boolean = false;
  public isAdminRoute: boolean = false;

  constructor(
    private productService: ProductService,
    private dialogService: DialogService,
    private sanitizer: DomSanitizer,
    private breakpointObserver: BreakpointObserver,
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private _authService: AuthService,
    private _addToCartService: AddToCartService,
    private router: Router,
    private currencyService: CurrencyService,
    private cdr: ChangeDetectorRef
  ) {
    this._authService.loginChanged.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
      if (loggedIn) {
        this.updateCartItemCount();
        const idAccountStr = localStorage.getItem('idAccount');
        if (idAccountStr) {
          this.idAccount = parseInt(idAccountStr);
          this.updateCartItemCount();
        }
      }
    });

    this.router.events.subscribe(() => {
      this.isAdminRoute = this.router.url.startsWith('/admin');
    });

    this.selectedCurrencyFlag = this.sanitizer.bypassSecurityTrustHtml(
      this.currencyFlags[this.selectedCurrency]
    );
    this.currencyService.selectedCurrency$.subscribe((currency) => {
      this.selectedCurrencyFlag = this.sanitizer.bypassSecurityTrustHtml(
        this.currencyFlags[currency]
      );
    });
  }

  public ngOnInit(): void {
    debugger
    const adminUserId = localStorage.getItem('adminUserId');
    if (adminUserId) {
      this.isAdmin = true;
    }
    //this.checkAdminStatus();
    this.currencySubscription = this.currencyService.selectedCurrency$.subscribe((selectedCurrency) => {
      this.toCurrency = selectedCurrency;
    });
    this._authService.isLoggedIn().then((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });

    // Retrieve idAccount from localStorage
    const idAccountStr = localStorage.getItem('idAccount');
    if (idAccountStr) {
      this.idAccount = parseInt(idAccountStr);
    }
    // Subscribe to cart changes
    this._addToCartService.cartItems$.subscribe((cartItems) => {
      this.cartItemCount = cartItems.length;
    });

    this.getCategories();
    this.setDisplayMode();
    this.updateCartItemCount();
  }

  public onCurrencyChange(newCurrency: string): void {
    this.selectedCurrency = newCurrency;
    this.currencyService.setSelectedCurrency(newCurrency); // Notify service of the currency change
  }

  public openLoginPopup(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '400px',
    });
  }

  public login(): void {
    this._authService.login();
  }

  public logout(): void {
    this._authService.logout();
  }

  public adminLogout(): void {
    localStorage.removeItem('adminUserId');
    localStorage.removeItem('lastLoginDate');
    this.isAdmin = false;
    
    // Retain passwordChanged flag until the user changes their password
    if (localStorage.getItem('passwordChanged') === 'false') {
      localStorage.setItem('passwordChanged', 'false');
    } else {
      localStorage.removeItem('passwordChanged');
    }
    this.router.navigate(['/admin/login']);
  }
  

  // Define the logout method
  // logout(): void {
  //   this.userService.logout();
  //   this.isAuthenticated = false;
  //   this._route.navigate(['/']);
  // }

  get userName(): string {
    return this._authService.authContext?.userProfile?.contactName;
  }

  public toggleMenuView(): any {
    this.viewMode = this.viewMode === 'desktop' ? 'mobile' : 'desktop';
  }

  public getCurrencies(): void {
    this.currencyService.fetchCurrencies().subscribe((response: any) => {
      this.currencies = Object.keys(response.data).map(key => {
        return {
          code: response.data[key].code,
          value: response.data[key].value
        };
      });
    });
  }

  public updateCartItemCount(): void {
    // Check if idAccount is defined before fetching cart items
    if (this.idAccount) {
      this._addToCartService
        .getCartItemsByUserId(this.idAccount)
        .subscribe((cartItems: any[]) => {
          this.cartItemCount = cartItems.length; // Update the cart item count
          this._addToCartService.updateCartItemCount(this.cartItemCount); // Emit the new cart item count
        });
    }
  }

  public setDisplayMode(): void {
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium])
      .subscribe((result) => {
        this.viewMode = result.matches
          ? result.breakpoints[Breakpoints.Medium]
            ? 'desktop'
            : 'mobile'
          : 'desktop';
        //this.isAuthenticated = this.userService.isLoggedIn();
      });
  }

  // Your observables and mapping logic
  //selectedCategories$ = this.productService.selectedtypesAction$;

  // Combine productGroups$ and selectedtypesAction$ and map the data
  // productCategories$ = combineLatest([
  //   this.productService.productGroups$,
  //   this.productService.selectedtypesAction$,
  // ]).pipe(
  //   map(([groups, types]) => {
  //     // Log the raw data for debugging

  //     // Create a map for quick lookup of types by groupId
  //     const typesMap = new Map(types.map(type => [type.groupId, type]));

  //     // Create a map for subcategories to organize them under their main group
  //     const subCategoriesMap = new Map<string, IProductSubGroup[]>();
  //     types.forEach(type => {
  //       if (type.subCode.trim() !== '' || type.isSubGroup) {
  //         const parentGroupId = type.groupId;
  //         const subCategories = subCategoriesMap.get(parentGroupId) || [];
  //         subCategories.push({
  //           groupId: type.groupId,
  //           groupCode: type.groupCode,
  //           subCode: type.subCode,
  //           groupName: type.groupName,
  //           isChecked: type.isChecked,
  //         });
  //         subCategoriesMap.set(parentGroupId, subCategories);
  //       }
  //     });

  //     // Map the groups to include subCategories
  //     return groups.map(group => {
  //       const matchingType = typesMap.get(group.groupId);

  //       // Create subCategories based on the map
  //       const subCategories = subCategoriesMap.get(group.groupId) || [];
  //       return {
  //         ...group,
  //         isCollapsed: matchingType?.isCollapsed ?? true,
  //         isChecked: matchingType?.isChecked ?? false,
  //         isIndeterminate:
  //           subCategories.length !== subCategories.filter(s => s.isChecked).length,
  //         subCategories: subCategories
  //       } as IProductGroup;
  //     });
  //   })
  // );

  // #region helper methods
  public getMatchingValues(
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

  public categorySelected(
    category: IProductGroup,
    checked: boolean
  ): any {
    let products = this.productService.mappedProductsStore.value;
    let filteredProducts: number[] = [];
    let groupIds: string[] = [];

    // Filter out the category and handle selection
    let filteredGroups = this.productService.selectedTypesSubject.value || [];

    if (!checked && filteredGroups.length > 0 &&
      !filteredGroups.find(g => g.groupId === category.groupId)) {
      return;
    }

    if (filteredGroups.length > 0) {
      filteredGroups = filteredGroups.filter(g => g.groupId !== category.groupId);
      category.subCategories?.forEach(s => s.isChecked = false);
    }

    if (checked) {
      category.subCategories?.forEach(s => s.isChecked = true);
      category.isChecked = true;
      filteredGroups.push(category);
    }

    filteredGroups.forEach(g => {
      if (g.isChecked) groupIds.push(g.groupId);
      g.subCategories?.forEach(s => {
        if (s.isChecked) groupIds.push(s.groupId);
      });
    });

    products.filter(p => groupIds.includes(p.groupId))
      .forEach(prod => filteredProducts.push(prod.id));

    let globalFilter = this.getMatchingValues(
      filteredProducts,
      this.productService.configFilterProducts,
      this.productService.analysisFilterProducts,
      this.productService.priceFilterProducts
    ) ?? [];

    if (filteredGroups.length > 0 && globalFilter.length === 0) {
      globalFilter.push(-1);
    }

    this.productService.groupFilterProducts = filteredProducts;
    this.productService.filteredProductsSubject.next(globalFilter);
    this.productService.selectedTypesSubject.next(filteredGroups);
  }

  public subcategorySelected(
    category: IProductGroup,
    subGroupId: string,
    event: MatCheckboxChange
  ): any {
    const checked = event.checked;
    let products = this.productService.mappedProductsStore.value;
    let filteredProducts: number[] = [];
    let groupIds: string[] = [];

    let filteredGroups = this.productService.selectedTypesSubject.value || [];

    filteredGroups = filteredGroups.filter(g => g.groupId !== category.groupId);

    const subCategory = category.subCategories?.find(s => s.groupId === subGroupId);
    if (subCategory) {
      subCategory.isChecked = checked;
    }

    category.isChecked = category.subCategories?.every(s => s.isChecked) ?? false;

    if (checked) {
      filteredGroups.push(category);
    } else if (category.subCategories?.some(s => s.isChecked)) {
      filteredGroups.push(category);
    }

    filteredGroups.forEach(g => {
      if (g.isChecked) groupIds.push(g.groupId);
      g.subCategories?.forEach(s => {
        if (s.isChecked) groupIds.push(s.groupId);
      });
    });

    products.filter(p => groupIds.includes(p.groupId))
      .forEach(prod => filteredProducts.push(prod.id));

    let globalFilter = this.getMatchingValues(
      filteredProducts,
      this.productService.configFilterProducts,
      this.productService.analysisFilterProducts,
      this.productService.priceFilterProducts
    ) ?? [];

    if (filteredGroups.length > 0 && globalFilter.length === 0) {
      globalFilter.push(-1);
    }

    this.productService.groupFilterProducts = filteredProducts;
    this.productService.filteredProductsSubject.next(globalFilter);
    this.productService.selectedTypesSubject.next(filteredGroups);
  }
  // #endregion

  public getCategories(): void {
    this.categoryService.getCategory().subscribe(
      (data: Category[]) => {
        this.categories = data;
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  public ngAfterViewInit(): void {
    this.elementPosition = this.menuElement?.nativeElement.offsetTop;
    if (this.siteContent) {
      const contentElement = this.siteContent.nativeElement;
      this.originalContent = contentElement.innerHTML;
    }
  }

  @HostListener('window:scroll', ['$event'])
  public handleScroll(): any {
    const windowScroll = window.pageYOffset;
    if (windowScroll >= this.elementPosition) {
      this.sticky = true;
    } else {
      this.sticky = false;
    }
  }

  public openInfoPopup(): void {
    this.dialogService.openDialog(InfoComponent, {
      width: '1000px',
      height: '430px',
    });
  }

  public performSearch(search: string): void {
    this.searchText = '';
    this.productService.setSearchText(search);
    //this.router.navigate(['/global-search'], { queryParams: { searchText: search } });
    this.router.navigate(['/global-search', search]);
  }

  //Commented for now
  // performSearch(search: string): void {
  //   this.searchText = '';
  //   this.productService.setSearchText(search);
  //   this.router.navigate(['/global-search/01/003'], { queryParams: { searchText: search } });
  // }

  // performSearch(search: string, categoryCode: string, subcategoryCode: string): void {
  //   this.searchText = '';
  //   this.productService.setSearchText(search);
  //   this.router.navigate(['/global-search'], {
  //     queryParams: {
  //       searchText: search,
  //       categoryCode: categoryCode,
  //       subcategoryCode: subcategoryCode
  //     }
  //   });
  // }

  public resetContent(element: HTMLElement): void {
    element.innerHTML = this.originalContent;
  }

  public searchAndHighlight(element: HTMLElement, searchText: string): void {
    const textNodes = element.childNodes;

    textNodes.forEach((node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent?.toLowerCase() || '';
        if (text.includes(searchText)) {
          const count = this.getCountOfOccurrences(text, searchText);
          const newNode = document.createElement('span');
          newNode.innerHTML = text.replace(
            new RegExp(searchText, 'gi'),
            (match) => {
              const highlighted = `<span class="highlighted-text">${match} (${count})</span>`;
              return highlighted;
            }
          );
          if (node.parentNode) {
            node.parentNode.replaceChild(newNode, node);
          }
        }
      } else {
        if (node.childNodes && node.childNodes.length > 0) {
          this.searchAndHighlight(node as HTMLElement, searchText);
        }
      }
    });
  }

  public getCountOfOccurrences(text: string, searchText: string): number {
    const regex = new RegExp(searchText, 'gi');
    const matches = text.match(regex);
    return matches ? matches.length : 0;
  }
}
