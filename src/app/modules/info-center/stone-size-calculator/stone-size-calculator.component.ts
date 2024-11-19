import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ProductService } from 'src/app/shared/services/modules/product.service';

@Component({
  selector: 'app-stone-size-calculator',
  templateUrl: './stone-size-calculator.component.html',
  styleUrls: ['./stone-size-calculator.component.scss'],
})
export class StoneSizeCalculatorComponent {
  public length: number = 0;
  public width: number = 0;
  public depth: number = 0;
  public weight: number = 0;
  public stoneDetails: any;
  public stoneType: number = 3.51; // Default to Diamond
  public shape: number = 0.0018; // Default to Round / Brilliant Cut
  public stoneForm!: FormGroup;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.getStoneDetails();
  }

  //Function to get stone details
  getStoneDetails() {
    this.productService.getStoneDetails().subscribe(
      (data) => {
        this.stoneDetails = data;
      },
      (error) => {
        console.error('Error fetching stone details', error);
      }
    );
  }

  //Function to calculate weight
  calculateWeight() {
    this.weight =
      this.stoneType * this.shape * this.length * this.width * this.depth;
  }

  //Function to calculate weigh on change stonetype
  onStoneTypeChange() {
    this.calculateWeight();
  }

  //Function to calculate weigh on change stoneshape
  onShapeChange() {
    this.calculateWeight();
  }
}
