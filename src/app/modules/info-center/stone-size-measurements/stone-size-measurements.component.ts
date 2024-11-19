import { Component } from '@angular/core';

@Component({
  selector: 'app-stone-size-measurements',
  templateUrl: './stone-size-measurements.component.html',
  styleUrls: ['./stone-size-measurements.component.scss']
})
export class StoneSizeMeasurementsComponent {
  stoneType: string | any;
  shape: string | any;
  length: number | any;
  width: number | any;
  depth: number | any;
  weight: number | any;

  calculateWeight() {
    let specificGravityConstant = 1; // Example value, you should get the specific gravity for each stone type

    this.weight = this.length * this.width * this.depth * specificGravityConstant;
  }
}
