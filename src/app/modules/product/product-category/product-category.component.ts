import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.scss']
})
export class ProductCategoryComponent {

  visible:boolean = false; 
  screenWidth:any;

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth > 767) {
      this.visible = true; 
    }
  }

  showHide(){ 
    this.visible = this.visible?false:true; 
  } 

  public expandView() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth < 767) {
      this.showHide();
    }
  }

}
