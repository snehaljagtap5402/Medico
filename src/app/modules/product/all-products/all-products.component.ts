import { Component, Input, OnInit } from '@angular/core';
import { ProductService } from '../../../shared/services/modules/product.service';
import { Category } from '../models/category';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.scss']
})
export class AllProductsComponent implements OnInit {

@Input() labels: string[] = [];
categories: Category[] = [];

groupCode: string | undefined;
subCode: string | undefined;

constructor(
  private productService: ProductService,
  private route: ActivatedRoute
) {}

ngOnInit(): void {
  this.route.params.subscribe(params => {
    this.groupCode = params['groupCode'];
    this.subCode = params['subcategoryCode'];
    this.fetchData();
  });
}

// fetchData(): void {
//   this.productService.getHomePageProducts()
//     .subscribe(data => {
//       this.categories = data;
//     });
// }

fetchData(): void {
  this.productService.getHomePageProducts()
    .subscribe(data => {
      // Assuming data is an array of Category objects
      this.categories = data.map((category: any) => ({
        ...category,
        Products: category.Products.map((product: any) => ({
          ...product,
          productId: product.StockId // Add productId property
        }))
      }));
    });
}

}