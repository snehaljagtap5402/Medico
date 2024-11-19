import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/shared/services/modules/product.service';
import { Product } from '../../product/models/product.model';
import { CurrencyService } from 'src/app/shared/services/currency.service';
import { AddToCartService } from 'src/app/shared/services/modules/add-to-cart.service';
import { CheckoutService } from 'src/app/shared/services/modules/checkout.service';
import { OrderService } from 'src/app/shared/services/modules/order.service';
import { UserDashboardService } from 'src/app/shared/services/modules/user-dashboard.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.scss']
})
export class ViewOrderComponent {

@Input() products: Product = {} as Product;
  @Input() selectedCurrency: string = 'GBP';
  //selectedCurrency: any;
  @Input() product: any;
  @Input() displayedColumns: string[] = [
    'id',
    'totalprice',
    'quantity',
    'price',
    'action',
  ];
  @Input() cartDetails: any;
  @Input() totalPrice = 0.0;
  orderDetails: any;
  //userId: any = localStorage.getItem('id');
  orderId: any;
  billingDetails: any[] = [];
  shippingDetails: any[] = [];
  contactDetail: any;
  isDataLoaded: boolean = false;
  public cartItems: any;
  currentDate = new Date();
  formattedDate = this.currentDate.toISOString().split('T')[0];
  endDate = this.formattedDate;
  startDate: any;
  ordersSummary: any[] = [];
  idAccount: any;
  pageSize: number = 15;
  currentPage: number = 1;
  pageCount = 0;
  users: any[] = [];
  order: any[] = [];

  constructor(
    private checkoutService: CheckoutService,
    private productService: ProductService,
    private addToCartService: AddToCartService,
    private orderService: OrderService,
    private route: ActivatedRoute,
     public currancyService: CurrencyService,
    private userDashboardService: UserDashboardService,
    private toasterService: ToastrService
  ) {}

  ngOnInit() {
    const idAccountStr = localStorage.getItem('idAccount');
     if (idAccountStr) {
       this.idAccount = parseInt(idAccountStr);
     }
     
     if (this.idAccount) {
      this.getUserByIdAccount(this.idAccount);
      this.getCheckOutDetails(this.idAccount);
    } else {
      this.toasterService.error(
        'User ID not found in local storage',
        'Error'
      );

    // this.route.params.subscribe((params) => {
    //   this.getCartItemsdetsilbyproduct;
    //   if (this.idAccount) {
    //     this.getCheckOutDetails(this.idAccount);
    //   } else {
    //     this.toasterService.error(
    //       'User ID not found in local storage',
    //       'Error'
    //     );
    //}
      // this.orderService.getAccountId(this.userId).subscribe(
      //   (data: any) => {
      //     this.users = Array.isArray(data) ? data : [data];
      //     this.idAccount = this.users[0].idAccount;
      //     const oneMonthBeforeEndDate = new Date(this.endDate);
      //     oneMonthBeforeEndDate.setMonth(oneMonthBeforeEndDate.getMonth() - 36);
      //     this.startDate = oneMonthBeforeEndDate.toISOString().split('T')[0];
      //     this.orderId = this.route.snapshot.paramMap.get('orderId')!;
      //     this.getOrdersHistory(this.orderId);
      //     this.fetchDeliveryAddress();
      //   },
      //   (error) => {
      //     console.error('Error fetching idAccount:', error);
      //   }
      //);
    
    }
  }

  getUserByIdAccount(idAccount: any): void {
    this.userDashboardService.getUserByIdAccount(idAccount).subscribe(
      (response: any) => {
        this.users = Array.isArray(response) ? response : [response];
        this.idAccount = this.users[0].idAccount;
        const oneMonthBeforeEndDate = new Date(this.endDate);
          oneMonthBeforeEndDate.setMonth(oneMonthBeforeEndDate.getMonth() - 36);
          this.startDate = oneMonthBeforeEndDate.toISOString().split('T')[0];
          this.orderId = this.route.snapshot.paramMap.get('orderId')!;
          this.getOrdersHistory(this.orderId);
          this.fetchDeliveryAddress();
      },
      (error: any) => {
        this.toasterService.error('Error fetching user by idAccount', error);
      }
    );
  }

  getOrdersHistory(orderNumber: string) {
    this.orderService
      .getOrders1(this.idAccount, this.startDate, this.endDate)
      .subscribe(
        (data: any[]) => {
          // Find the order with the specified orderNumber
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
          } else {
            console.error('Order not found:', orderNumber);
          }
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
  }

  getOrderDetail() {
    this.orderService.getOrderById(this.orderId).subscribe((response: any) => {
      this.order = Array.isArray(response) ? response : [response];
      this.orderDetails = response[0];
    });
  }

  getCheckOutDetails(idAccount: any): void {
    this.userDashboardService.getUserByIdAccount(idAccount).subscribe(
      (response: any) => {
        this.billingDetails = Array.isArray(response) ? response : [response];
      },
      (error: any) => {
        this.toasterService.error('Error fetching user by idAccount', error);
      }
    );
  }

  fetchDeliveryAddress(): void {
    this.orderService.getShipping(this.orderId).subscribe(
      (Data: any) => {
        this.shippingDetails = Array.isArray(Data) ? Data : [Data];
      },
      (error) => {
        console.error('Error fetching shipping details:', error);
      }
    );
  }

  public getCartItemsdetsilbyproduct() {
    this.totalPrice = 0.0;
    this.addToCartService.getProductFromCart().subscribe((data: any) => {
      this.currancyService.selectedCurrency$.subscribe((currency) => {
        this.selectedCurrency = currency;
      });
      if (data && this.product) {
        this.cartItems = [];
        this.cartDetails = [];
        data.forEach((cartDetail: any) => {
          if (!cartDetail.placeOrder) {
            this.totalPrice = parseFloat(
              (this.totalPrice + cartDetail.price).toFixed(2)
            );
            let product = this.product.filter(
              (x: { id: any }) => x.id == cartDetail.productId
            );
            cartDetail.imgUrl = product[0].imageUrl;
            cartDetail.description = product[0].description;
            cartDetail.description = product[0].description;
            cartDetail.refcodes = product[0].refcodes[0].refcode;
            if (
              product[0].refcodes[0].prices[this.selectedCurrency] !== undefined
            ) {
              cartDetail.pricePerProduct =
                product[0].refcodes[0].prices[this.selectedCurrency].toFixed(2);
            } else {
              cartDetail.pricePerProduct = 'N/A';
            }
            cartDetail.pricePerProduct = product[0].refcodes[0].prices;
            this.cartDetails.push(cartDetail);
          }
        });
      }
    });
  }
}