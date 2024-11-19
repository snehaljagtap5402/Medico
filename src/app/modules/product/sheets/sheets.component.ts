import { Component } from '@angular/core';
import { ProductService } from '../../../shared/services/modules/product.service';
import { Product } from '../models/product.model';
import { Category } from '../models/category';
import { CategoryService } from 'src/app/shared/services/modules/category.service';

@Component({
  selector: 'app-sheets',
  templateUrl: './sheets.component.html',
  styleUrls: ['./sheets.component.scss']
})
export class SheetsComponent {
  categorizedProducts: any;
  sheets:any;

  constructor(private categoryService: CategoryService, private productService: ProductService) { }
  ngOnInit(){
    this.productService.getProducts().subscribe(
      (products: Product[]) => {        
        // Fetch categories to use for categorization
        this.categoryService.getCategories().subscribe(
          (categories: Category[]) => {
            // Categorize products based on category  
            let sheetCategoryId = categories.filter(x=>x.name == 'Sheet').map(m=>m.id);
            this.sheets = products.filter(x=>x.categoryId == sheetCategoryId[0]);             
          }
        );
      }
    );


    
  }
}
