import { Component, Inject, Input, ViewChild,} from '@angular/core';
import { NgxPrintDirective } from 'ngx-print';
import { UserDashboardService } from 'src/app/shared/services/modules/user-dashboard.service';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from '../../product/models/product.model';
import { OrderService } from 'src/app/shared/services/modules/order.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-checkout-complete',
  templateUrl: './checkout-complete.component.html',
  styleUrls: ['./checkout-complete.component.scss'],
})
export class CheckoutCompleteComponent {
  @ViewChild(NgxPrintDirective, { static: false }) ngxPrintDirective: | NgxPrintDirective | any;
  @Input() orderNo: string;
  @Input() products: Product = {} as Product;
  @Input() product: any;
  @Input() displayedColumns: string[] = ['id', 'totalprice', 'quantity', 'price', 'action',];
  @Input() cartDetails: any;
  @Input() totalPrice = 0.0;
  public selectedCurrency: any;
  public orderDetails: any;
  public userId: number | any;
  public billingDetails: any;
  public shippingDetails: any;
  public contactDetail: any;
  public isDataLoaded: boolean = false;
  public cartItems: any;
  public idAccount: any;
  public currentDate = new Date();
  public formattedDate = this.currentDate.toISOString().split('T')[0];
  public endDate = this.formattedDate;
  public startDate: any;
  public users: any[] = [];
  public cartId: any;
  public cartProducts: any[] = [];
  public isPrintContentReady: boolean = false;
  public showPrintOrderComponent = false;

  constructor(
    private dialogRef: MatDialogRef<CheckoutCompleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private orderService: OrderService,
    private userDashboardService: UserDashboardService,
    private router: Router,
    private toastrService: ToastrService,
  ) { this.orderNo = data.orderNo; }

  ngOnInit() {
    //this.userId = localStorage.getItem('id');
    const idAccountStr = localStorage.getItem('idAccount');
     if (idAccountStr) {
       this.idAccount = parseInt(idAccountStr);
     }
     this.getUserByIdAccount(this.idAccount);
    // this.orderService.getAccountId(this.userId).subscribe(
    //   (data: any) => {
    //     this.users = Array.isArray(data) ? data : [data];
    //     this.idAccount = this.users[0].idAccount;
    //     const oneMonthBeforeEndDate = new Date(this.endDate);
    //     oneMonthBeforeEndDate.setMonth(oneMonthBeforeEndDate.getMonth() - 36);
    //     this.startDate = oneMonthBeforeEndDate.toISOString().split('T')[0];
    //     this.getOrdersHistory(this.orderNo);
    //     this.getCheckOutDetails(this.userId);
    //   },
    //   (error) => {
    //     console.error('Error fetching idAccount:', error);
    //   }
    // );
  }

  
  getUserByIdAccount(idAccount: any): void {
    this.userDashboardService.getUserByIdAccount(idAccount).subscribe(
      (response: any) => {
        this.users = Array.isArray(response) ? response : [response];
        this.idAccount = this.users[0].idAccount;
        const oneMonthBeforeEndDate = new Date(this.endDate);
        oneMonthBeforeEndDate.setMonth(oneMonthBeforeEndDate.getMonth() - 36);
        this.startDate = oneMonthBeforeEndDate.toISOString().split('T')[0];
        this.getOrdersHistory(this.orderNo);
        this.getCheckOutDetails(this.idAccount);
      },
      (error: any) => {
        this.toastrService.error('Error fetching user by idAccount', error);
      }
    );
  }

  openOrderInNewTab(orderNo: string): void {
    const url = `/view-order/${orderNo}`;
    window.open(url, '_blank');
    localStorage.removeItem('sessionId');
    localStorage.removeItem('newOrder');
    localStorage.removeItem('cartId');
  }

  getOrdersHistory(orderNumber: string) {
    this.orderService.getOrders1(this.idAccount, this.startDate, this.endDate).subscribe(
        (data: any[]) => {
          const order = data.find((order) => order.orderNo === orderNumber);
          if (order) {
            this.orderDetails = {
              orderDate: order.date,
              items: (order.lines as any[]).map((line: any) => {
                return {
                  itemCode: line.productRef,
                  description: line.description,
                  quantity: line.quantity,
                  itemPrice: line.unitPrice,
                  lineTotal: line.lineTotal,
                };
              }),
            };
            this.isPrintContentReady = true;
          } else {
            console.error('Order not found:', orderNumber);
          }
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
  }

  // getCheckOutDetails(userId: any): void {
  //   this.userDashboardService.getUserById(userId).subscribe(
  //     (response: any) => {
  //       this.billingDetails = Array.isArray(response) ? response : [response];
  //     },
  //     (error: any) => {
  //       console.error('Error fetching data:', error);
  //     }
  //   );
  // }

  getCheckOutDetails(idAccount: any): void {
    this.userDashboardService.getUserByIdAccount(idAccount).subscribe(
      (response: any) => {
        this.billingDetails = Array.isArray(response) ? response : [response];
      },
      (error: any) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  closePopup() {
    this.dialogRef.close();
  }

  navigateToDashboard() {
    this.router.navigate(['/user/dashboard']);
  }
}
