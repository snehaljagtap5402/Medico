import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from 'src/app/shared/services/modules/order.service';
import { ProductService } from 'src/app/shared/services/modules/product.service';
import { UserDashboardService } from 'src/app/shared/services/modules/user-dashboard.service';

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.scss'],
})
export class AllOrdersComponent {
  recentOrders: any[] = [];
  pageSize: number = 15;
  currentPage: number = 1;
  userId: any = localStorage.getItem('id');
  idAccount: any;
  currentDate = new Date();
  formattedDate = this.currentDate.toISOString().split('T')[0];
  endDate = this.formattedDate;
  startDate: any;
  ordersSummary: any[] = [];
  orders: any[] | any;
  itemsPerPage = 15;
  pageCount = 0;
  public users: any[] = [];

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private toasterService: ToastrService,
    private userDashboardService: UserDashboardService
  ) {}

  ngOnInit() {
    // Retrieve idAccount from localStorage
    const idAccountStr = localStorage.getItem('idAccount');
    if (idAccountStr) {
      this.idAccount = parseInt(idAccountStr);
    }
    this.getUserByIdAccount(this.idAccount);
    //this.getAccountId();
  }

  //Function to get user by idAccount
  public getUserByIdAccount(idAccount: any): void {
    this.userDashboardService.getUserByIdAccount(idAccount).subscribe(
      (response: any) => {
        this.users = Array.isArray(response) ? response : [response];
        const oneMonthBeforeEndDate = new Date(this.endDate);
        oneMonthBeforeEndDate.setMonth(oneMonthBeforeEndDate.getMonth() - 24);
        this.startDate = oneMonthBeforeEndDate.toISOString().split('T')[0];
        this.getOrdersHistory(this.idAccount);
        this.getOrdersForUser();
      },
      (error: any) => {
        this.toasterService.error('Error fetching user by idAccount', error);
      }
    );
  }

  get paginatedProducts(): any[] {
    return this.orders.products;
  }

  formatOrderDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
      date
    );
    const year = date.getFullYear();
    const dayWithSuffix =
      day +
      (day % 10 === 1 && day !== 11
        ? 'st'
        : day % 10 === 2 && day !== 12
        ? 'nd'
        : day % 10 === 3 && day !== 13
        ? 'rd'
        : 'th');
    return `${dayWithSuffix} ${month} ${year}`;
  }

  getOrdersForUser() {
    this.orderService
      .getOrders1(this.idAccount, this.startDate, this.endDate)
      .subscribe((data) => {
        this.recentOrders = data;
        this.reverseOrder();
      });
  }


  //Function to get orderHistory
  public getOrdersHistory(idAccount: any) {
    this.orderService.getFilterOrders(idAccount, this.startDate, this.endDate, this.currentPage, this.pageSize)
  .subscribe(
    (data: any) => {
      // Check if data.products is an array before attempting to map
      if (Array.isArray(data.products)) {
        this.ordersSummary = data.products.map((order: any) => {
          return {
            orderId: order.orderNo,
            orderDate: this.formatOrderDate(order.date),
            totalItems: order.lines.length,
            subtotal: this.calculateSubtotal(order.lines),
            vat: this.calculateVAT(order.lines),
            total: this.calculateTotal(order.lines),
          };
        });
      } else {
        console.error('Error: data.products is not an array');
      }
      // Assuming pageCount is part of the data object
      this.pageCount = data.pageCount;
      this.orders = data;
      this.pageCount = this.orders.pageCount;
      this.paginatedProducts;
    },
    (error) => {
      console.error('Error fetching data:', error);
    }
  );

  }

    //Function to calculate subtotal
    public calculateSubtotal(lines: any[]): number {
      return lines.reduce((total, line) => total + line.lineTotal, 0);
    }
  
    //Function to calculate VAT
    public calculateVAT(lines: any[]): number {
      const vatRate = 0.2;
      const subtotal = this.calculateSubtotal(lines);
      return subtotal * vatRate;
    }
  
    //Function to calculate Total
    public calculateTotal(lines: any[]): number {
      const subtotal = this.calculateSubtotal(lines);
      const vat = this.calculateVAT(lines);
      return subtotal - vat;
    }


  onPageChange(page: number): void {
    this.currentPage = page;
    this.getOrdersHistory(this.idAccount);
  }

  goToFirstPage(): void {
    const totalPages = this.getTotalPages();
    if (this.currentPage !== totalPages) {
      this.currentPage = totalPages;
      this.getOrdersHistory(this.idAccount);
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getOrdersHistory(this.idAccount);
    }
  }

  getPaginationRange(): number[] {
    return Array.from({ length: this.pageCount }, (_, i) => i + 1);
  }

  goToNextPage(): void {
    this.currentPage = this.currentPage + 1;
    this.getOrdersHistory(this.idAccount);
  }

  goToLastPage(): void {
    this.currentPage = this.pageCount;
    this.getOrdersHistory(this.idAccount);
  }

  reverseOrder(): void {
    if (this.recentOrders && this.recentOrders.length > 0) {
      this.recentOrders = this.recentOrders.slice().reverse();
    }
  }

  // getTotalPages(): number {
  //   return this.orders.products
  //     ? Math.ceil(this.orders.products.length / this.itemsPerPage)
  //     : 0;
  // }

  getTotalPages(): number {
    return this.orders && this.orders.products
      ? Math.ceil(this.orders.products.length / this.itemsPerPage)
      : 0;
  }
  

  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
  }

  getPaginatedOrders(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.ordersSummary.slice(startIndex, endIndex);
  }

  openOrderInNewTab(orderId: string): void {
    const url = `/view-order/${orderId}`;
    window.open(url, '_blank');
  }
}
