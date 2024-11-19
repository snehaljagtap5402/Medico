import { Component, Input } from '@angular/core';
import { Product } from '../../product/models/product.model';
import { ActivatedRoute } from '@angular/router';
import { CheckoutService } from 'src/app/shared/services/modules/checkout.service';
import { OrderService } from 'src/app/shared/services/modules/order.service';
import { AddToCartService } from 'src/app/shared/services/modules/add-to-cart.service';
import { CurrencyService } from 'src/app/shared/services/currency.service';

@Component({
  selector: 'app-print-order',
  templateUrl: './print-order.component.html',
  styleUrls: ['./print-order.component.scss']
})
export class PrintOrderComponent {
  @Input() products: Product = {} as Product;
  //@Input() selectedCurrency: string = 'GBP';
  @Input() product: any;
  @Input() displayedColumns: string[] = ['id', 'totalprice', 'quantity', 'price', 'action'];
  @Input() cartDetails: any;
  @Input() totalPrice = 0.00;
  public orderDetails: any;
  public userId: number | any;
  public orderId: any;
  public billingDetails: any; 
  public shippingDetails : any;
  public contactDetail : any;
  public isDataLoaded: boolean = false;
  public cartItems: any;
  public selectedCurrency: any;

  constructor(
    private checkoutService: CheckoutService,
    private addToCartService : AddToCartService,
    private orderService: OrderService,
    private route: ActivatedRoute,
    public currancyService : CurrencyService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.orderId = this.route.snapshot.paramMap.get('orderId')!;
      this.getOrderDetail();
      this.getCartItemsdetsilbyproduct;
      this.getCheckOutDetails();
    });
  }

  getOrderDetail() {
    this.orderService.getOrderById(this.orderId).subscribe((response: any) => {
      this.orderDetails = response[0];
    });
  }

  getCheckOutDetails() {
    const userId = localStorage.getItem('id');
    if (userId) {
      this.checkoutService.getCheckoutDetails(parseInt(userId)).subscribe((data: any) => {
        if (data && data.length > 0) {
          this.billingDetails = data[0];
          this.shippingDetails = data[0];
          this.contactDetail = data[0];
          this.isDataLoaded = true; 
        }
      });
    }
  }

  public getCartItemsdetsilbyproduct() {
    this.totalPrice = 0.00;
    this.addToCartService.getProductFromCart().subscribe((data: any) => {
      this.currancyService.selectedCurrency$.subscribe((currency) => {
        this.selectedCurrency = currency;
      });
      if (data && this.product) {
        this.cartItems = [];
        this.cartDetails = [];
        data.forEach((cartDetail: any) => {
          if (!cartDetail.placeOrder) {
            this.totalPrice = parseFloat((this.totalPrice + cartDetail.price).toFixed(2));
            let product = this.product.filter((x: { id: any; }) => x.id == cartDetail.productId);
            cartDetail.imgUrl = product[0].imageUrl;
            cartDetail.description = product[0].description;
            cartDetail.description = product[0].description;
            cartDetail.refcodes = product[0].refcodes[0].refcode;
            if (product[0].refcodes[0].prices[this.selectedCurrency] !== undefined) {
              cartDetail.pricePerProduct = product[0].refcodes[0].prices[this.selectedCurrency].toFixed(2);
            } else {
              cartDetail.pricePerProduct = 'N/A';
            }
            cartDetail.pricePerProduct = product[0].refcodes[0].prices
            this.cartDetails.push(cartDetail);
          }
        });
      }
    });
  }
}