import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MetalType } from 'src/app/enum/metal-type';
import { ProductService } from '../../shared/services/modules/product.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  productId: number = 0;
  product: any; 
  displayedColumns: string[] = ['id','totalprice','quantity','price','action'];
  cartDetails:any;
  TableData=[];

  // Define the metalTypes array with values from the enum
  metalTypes: string[] = Object.values(MetalType);

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {  
    this.productId = 1;
    this.productService.getProducts().subscribe((product) => {
      if (product) {        
        this.product = product;        
      } else {
        // Handle the case where the product is not found
      }
    });    
    // this.productService.getProductFromCart().subscribe((data: any[])=>{     
    //   this.cartDetails =[];    
    //   data.forEach((cartDetail: any)=> {        
    //     let product = this.product.filter((x: { id: any; }) =>x.id == cartDetail.productId);
    //     cartDetail.imgUrl = product[0].imageUrl;
    //     cartDetail.description = product[0].description;
    //     cartDetail.refcodes = product[0].refcodes[0].refcode;
    //     cartDetail.pricePerProduct = product[0].refcodes[0].prices.EUR
    //     this.cartDetails.push(cartDetail);
    //   });       
    // });
    
    // Fetch the product details using the ProductService
    
  }

  onRefCodeClick (refCode: any) {
    let url = this.router.url+'/'+refCode    
    this.router.navigate([url]);
  }
}
