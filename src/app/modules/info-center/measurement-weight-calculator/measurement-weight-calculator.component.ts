import { Component } from '@angular/core';
import { MetalType } from 'src/app/enum/metal-type';
import { ProductService } from 'src/app/shared/services/modules/product.service';

interface ConversionFactors {
  [key: string]: number;
}
interface Alloy {
  name: string;
  density: number; // Density in g/cm^3 or any unit of your choice
}

@Component({
  selector: 'app-measurement-weight-calculator',
  templateUrl: './measurement-weight-calculator.component.html',
  styleUrls: ['./measurement-weight-calculator.component.scss'],
})
export class MeasurementWeightCalculatorComponent {
  public lengthValue: number = 0;
  public fromUnit: string = 'mm';
  public toUnit: string = 'cm';
  public result: number = 0;
  public weightValue: number = 0;
  public fromWeightUnit: string = 'Grams';
  public toWeightUnit: string = 'Grams';
  public conversion: any = 0;
  public metalTypes: any[] = [];
  public fromAlloy: any = 'Platinum';
  public toAlloy: any = 'Platinum';
  public fromAlloyValue: number = 0.48;
  public toAlloyValue: number = 0.48;
  public weightAlloyValue: number = 0;
  public Convert: number = 0;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.fetchMetalTypes();
    this.convertAlloyWeight();
  }

  conversionFactors: ConversionFactors = {
    mm: 1,
    cm: 10,
    meters: 1000,
    inches: 25.4,
    yards: 914.4,
    feet: 304.8,
  };

  // conversionWeightFactors: ConversionFactors = {
  //   g: 1,
  //   kg: 1000,
  //   'oz t': 31.1035, // Ounces, troy
  //   'lb t': 373.242, // Pounds, troy
  //   'oz av': 28.3495, // Ounces, Avoir
  //   'lb av': 453.592, // Pounds, Avoir
  //   carat: 0.2,
  //   grain: 0.0648,
  // };

  conversionWeightFactors: ConversionFactors = {
    Grams: 1,
    Kilograms: 1000,
    'Ounces, troy': 31.1035, // Ounces, troy
    'Pounds, troy': 373.242, // Pounds, troy
    'Ounces, Avoir': 28.3495, // Ounces, Avoir
    'Pounds, Avoir': 453.592, // Pounds, Avoir
    Carats: 0.2,
    Grains: 0.0648,
  };

  convertLength() {
    const valueInMm = this.lengthValue * this.conversionFactors[this.fromUnit];
    const resultInMm = valueInMm / this.conversionFactors[this.toUnit];
    this.result = +resultInMm.toFixed(2); // Convert result to a string with two decimal places
  }
  

  onLengthValueChange() {
    this.convertLength();
  }

  onUnitChange() {
    this.convertLength();
  }
  
  convertWeight() {
    // Calculate the conversion value in grams
    const valueInGrams = this.weightValue * this.conversionWeightFactors[this.fromWeightUnit];
    
    // Calculate the final conversion value based on the target weight unit
    this.conversion = valueInGrams / this.conversionWeightFactors[this.toWeightUnit];
  
    // Ensure the conversion value is displayed with exactly two digits after the decimal point
    this.conversion = this.conversion.toFixed(2); // Convert to string with 2 decimal places
  }
  

  onWeightValueChange() {
    this.convertWeight();
  }

  onWeightUnitChange() {
    this.convertWeight();
  }

  // fromAlloy: Alloy = { name: 'Alloy A', density: 7.8 }; // Change the default density
  // toAlloy: Alloy = { name: 'Alloy B', density: 8.0 }; // Change the default density

  // convertAlloyWeight() {
  //   this.Convert = (this.weightAlloyValue * this.fromAlloy.density) / this.toAlloy.density;
  // }

  convertAlloyWeight() {
    if (!isNaN(this.fromAlloyValue) && !isNaN(this.toAlloyValue)) {
      const weight = this.weightAlloyValue * this.fromAlloyValue;
      this.Convert = weight / this.toAlloyValue;
    } else {
      this.Convert = 0;
    }
  }

  // onAlloyWeightValueChange() {
  //   this.convertWeight();
  // }

  onAlloyWeightValueChange() {
    this.convertAlloyWeight();
  }

  // onAlloyChange() {
  //   this.convertWeight();
  // }

  onAlloyChange() {
    // Assign the corresponding value based on the label
    this.fromAlloyValue = this.alloyValueMapping[this.fromAlloy];

    // Set toAlloy based on the selected alloy
    this.toAlloyValue = this.alloyValueMapping[this.toAlloy];

    // Call convertAlloyWeight() to recalculate the conversion
    this.convertAlloyWeight();
  }

  // Define alloyValueMapping as a class property
  alloyValueMapping: { [label: string]: number } = {
    'Platinum': 0.48,
    '22ct Yellow': 0.53,
    '18ct Yellow': 0.58,
    '18ct White': 0.64,
    '18ct Red': 0.66,
    '14ct Yellow': 0.75,
    '9ct Yellow': 0.92,
    '9ct White': 0.89,
    '9ct Red': 0.93,
    'Silver': 1,
    'Wax': 10.3,
  };

  //Function to fetch metal types
  fetchMetalTypes() {
    this.productService.getAllAlloys().subscribe(
      (data: any[]) => {
        this.metalTypes = data.map((item) => item.stockDescription);
      },
      (error) => {
        console.error('Error fetching metal types', error);
      }
    );
  }
}
