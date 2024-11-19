import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CurrencyService } from 'src/app/shared/services/currency.service';
import { AuthService } from 'src/app/shared/services/modules/auth.service';
import { OrderService } from 'src/app/shared/services/modules/order.service';
import { UserDashboardService } from 'src/app/shared/services/modules/user-dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class dashboardComponent {
  public userDashboardData: any;
  public upliftCharge: number = 0;
  public showMessage: boolean = false;
  public isAuthenticated: boolean = false;
  public addressesToDelete: any[] = [];
  public users: any[] = [];
  public recentOrders: any[] = [];
  public idAccount: any;
  public currentDate = new Date();
  public formattedDate = this.currentDate.toISOString().split('T')[0];
  public endDate = this.formattedDate;
  public startDate: any;
  public ordersSummary: any[] = [];
  public addresses: any[] = [];
  public selectedAddresses: any[] = [];
  public selectedCurrency: any;
  public userProfile: any;
  public addressDetails: any[] = [];
  public errorMessage: string | null = null;

  constructor(
    private userDashboardService: UserDashboardService,
    private orderService: OrderService,
    private toasterService: ToastrService,
    public currancyService: CurrencyService
  ) {}

  ngOnInit() {
    // Retrieve idAccount from localStorage
    const idAccountStr = localStorage.getItem('idAccount');
    if (idAccountStr) {
      this.idAccount = parseInt(idAccountStr);
    }
    this.getUserByIdAccount(this.idAccount);

    const storedUpliftCharge = localStorage.getItem('upliftCharge');
    if (storedUpliftCharge) {
      this.upliftCharge = parseInt(storedUpliftCharge, 10) || 0; 
    }
  }

  //Function to get orderHistory
  public getOrdersHistory(idAccount: any) {
    this.orderService.getOrders1(idAccount, this.startDate, this.endDate).subscribe(
        (data: any) => {
          this.ordersSummary = data.map((order: any) => {
            return {
              orderId: order.orderNo,
              orderDate: this.formatOrderDate(order.date),
              totalItems: order.lines.length,
              subtotal: this.calculateSubtotal(order.lines),
              vat: this.calculateVAT(order.lines),
              total: this.calculateTotal(order.lines),
            };
          });
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

  //Function to format order date
  public formatOrderDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
      date
    );
    const year = date.getFullYear();
    // Add the ordinal suffix to the day (e.g., 1st, 2nd, 3rd, 4th)
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

  //Function to get user by idAccount
  public getUserByIdAccount(idAccount: any): void {
    this.userDashboardService.getUserByIdAccount(idAccount).subscribe(
      (response: any) => {
        this.users = Array.isArray(response) ? response : [response];
        this.getAddressDetails(this.idAccount);
        const oneMonthBeforeEndDate = new Date(this.endDate);
        oneMonthBeforeEndDate.setMonth(oneMonthBeforeEndDate.getMonth() - 12);
        this.startDate = oneMonthBeforeEndDate.toISOString().split('T')[0];
        this.getOrdersHistory(this.idAccount);
      },
      (error: any) => {
        this.toasterService.error('Error fetching user by idAccount', error);
      }
    );
  }

  //Function to load address by idAccount
  public getAddressDetails(idAccount: any): void {
    this.userDashboardService.getAddressDetailsByIdAccount(idAccount).subscribe(
      (addresses: any[]) => {
        this.addresses = Array.isArray(addresses) ? addresses : [addresses];
        this.addresses.forEach((address) => (address.isSelected = false));
      },
      (error: any) => {
        console.error('Error fetching addresses:', error);
      }
    );
  }

  //Function to reverse orders
  public reverseOrder(): void {
    if (this.recentOrders && this.recentOrders.length > 0) {
      this.recentOrders = this.recentOrders.slice().reverse();
    }
  }

  // Method to update the uplift charge
  // public updateUpliftCharge(newUpliftCharge: number) {
  //   if (newUpliftCharge >= 1 && newUpliftCharge <= 999) {
  //     this.upliftCharge = newUpliftCharge;
  //     this.showMessage = true;
      
  //     setTimeout(() => {
  //       this.showMessage = false;
  //     }, 3000);
  //   } else {
  //   }
  // }

  public updateUpliftCharge(newUpliftCharge: number) {
    if (newUpliftCharge >= 1 && newUpliftCharge <= 999) {
        localStorage.setItem('upliftCharge', newUpliftCharge.toString());
        this.showMessage = true;
        this.errorMessage = null;
        
        setTimeout(() => {
        this.showMessage = false;
      }, 3000);
    } 
    else {
      this.errorMessage = 'Uplift charge must be between 1 and 999.';
      this.showMessage = false; 
    }
  }

  //Function to toggle selected address
  public toggleAddressSelection(address: any): void {
    address.isSelected = !address.isSelected;
    // Update selectedAddresses array based on selection
    if (address.isSelected) {
      this.selectedAddresses.push(address);
    } else {
      this.selectedAddresses = this.selectedAddresses.filter(
        (selectedAddress) => selectedAddress !== address
      );
    }
  }

  //Function to delete address
  public deleteCheckedAddresses() {
    if (this.selectedAddresses.length > 0) {
      const sqlIdsToDelete = this.selectedAddresses.map(
        (address) => address.sqlid
      );
      this.userDashboardService.deleteAddressesBySqlIds(sqlIdsToDelete).subscribe(
          () => {
            this.toasterService.success('Address Deleted', 'Deleted');
            // Clear selectedAddresses array after deletion
            this.selectedAddresses = [];
            this.getAddressDetails(this.idAccount);
          },
          (error) => {
            this.toasterService.error('Error deleting addresses', 'Error');
          }
        );
    }
  }

  public openOrderInNewTab(orderId: string): void {
    const url = `/view-order/${orderId}`;
    window.open(url, '_blank');
  }
}
