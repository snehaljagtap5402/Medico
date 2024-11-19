import { Component } from '@angular/core';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { InfoComponent } from '../info/info.component';
import { FormGroup } from '@angular/forms';
import { ProductService } from 'src/app/shared/services/modules/product.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-stone-calculator',
  templateUrl: './stone-calculator.component.html',
  styleUrls: ['./stone-calculator.component.scss']
})
export class StoneCalculatorComponent {
  public length: number = 0;
  public width: number = 0;
  public depth: number = 0;
  public weight: number = 0;
  public stoneDetails: any;
  public stoneType: number = 3.51; // Default to Diamond
  public shape: number = 0.0018; // Default to Round / Brilliant Cut
  public stoneForm!: FormGroup;
  constructor(private dialogService: DialogService, private productService: ProductService, private dialogRef: MatDialogRef<InfoComponent>) {}

  openInfoPopup(): void {
    this.dialogService.openDialog(InfoComponent, {
      width: '1000px',
      height: '430px',
    });
  }

  ngOnInit() {
    this.getStoneDetails();
  }

    
  closePopup() {
    this.dialogRef.close();
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
