import { Component } from '@angular/core';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { InfoComponent } from '../info/info.component';
import { MetalType } from 'src/app/enum/metal-type';
import { ProductService } from 'src/app/shared/services/modules/product.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-finger-calculator',
  templateUrl: './finger-calculator.component.html',
  styleUrls: ['./finger-calculator.component.scss'],
})
export class FingerCalculatorComponent {
  public gauge: number = 0;
  public width: number = 0;
  public calculatedLength: number = 0;
  public calculatedWeight: number = 0;
  public metalTypes: any[] = [];
  public alloy: string = 'platinum';
  public fingerSize: string = 'Size J';

  constructor(
    private productService: ProductService,
    private dialogService: DialogService,
    private dialogRef: MatDialogRef<InfoComponent>
  ) {}

  ngOnInit(): void {
    this.calculate();
    this.fetchMetalTypes();
  }

  closePopup() {
    this.dialogRef.close();
  }

  openInfoPopup(): void {
    this.dialogService.openDialog(InfoComponent, {
      width: '1000px',
      height: '430px',
    });
  }

  // Conversion factors, you might replace these with actual conversion formulas
  conversionFactors = {
    gaugeToMm: 0.2,
    widthToMm: 0.3,
  };

  calculate() {
    // Alloy gravity data
    const alloyData = {
      platinum: { gravity: 20.1 },
      '22ct-yellow-gold': { gravity: 17.8 },
      '18ct-white-gold': { gravity: 16.2 },
      '18ct-yellow-gold': { gravity: 15.5 },
      '18ct-red-gold': { gravity: 15.2 },
      '14ct-yellow-gold': { gravity: 13.0 },
      '9ct-white-gold': { gravity: 11.9 },
      '9ct-yellow-gold': { gravity: 11.2 },
      '9ct-red-gold': { gravity: 11.1 },
      'palladium': { gravity: 12.0 },
      'silver': { gravity: 10.3 },
      'platinum-18ct-yellow': { gravity: 20.1 },
      'platinum-18ct-red': { gravity: 20.1 },
      'platinum-18ct-red-yellow': { gravity: 20.1 },
      '18ct-yellow-white': { gravity: 16.2 },
      '18ct-white-red': { gravity: 16.2 },
      '18ct-white-red-yellow': { gravity: 15.2 },
      '18ct-yellow-platinum': { gravity: 15.5 },
      '18ct-yellow-red-gold': { gravity: 15.5 },
      '18ct-red-platinum': { gravity: 15.2 },
      '18ct-red-white': { gravity: 15.2 },
      '18ct-red-yellow': { gravity: 15.2 },
      '9ct-white-yellow': { gravity: 11.9 },
      '9ct-white-red': { gravity: 11.9 },
      '9ct-white-red-yellow': { gravity: 11.9 },
      '9ct-yellow-red': { gravity: 11.2 },
      '9ct-yellow-palladium': { gravity: 11.2 },
      'palladium-18ct-yellow': { gravity: 12.0 },
      'palladium-18ct-red': { gravity: 12.0 },
      'palladium-18ct-red-yellow': { gravity: 12.0 },
      'palladium-9ct-yellow': { gravity: 12.0 },
      'palladium-9ct-red': { gravity: 12.0 },
      'palladium-9ct-red-yellow': { gravity: 12.0 },
    };

    // Get gravity based on selected alloy
    const gravity = (alloyData as any)[this.alloy].gravity;

    const selectedFingerSizeObj = this.fingerSizes.find(
      (size) => size.label === this.fingerSize
    );

    if (selectedFingerSizeObj) {
      const fingerSize = selectedFingerSizeObj.value;

      // Check if the gauge is greater than zero
      if (this.gauge > 0) {
        // If gauge is greater than zero, calculate the length
        this.calculatedLength = fingerSize + this.gauge * 2;
      } else {
        // If gauge is zero, set the length to zero
        this.calculatedLength = 0;
      }
      this.calculatedWeight =
        ((this.gauge * this.calculatedLength * this.width) / 1000) * gravity;
    }
  }

  fetchMetalTypes() {
    this.productService.getAllAlloys().subscribe(
      (data: MetalType[]) => {
        this.metalTypes = data;
      },
      (error: any) => {
        console.error('Error fetching metal types', error);
      }
    );
  }

  fingerSizes = [
    { value: 37.8252, label: 'Size A' },
    { value: 38.4237, label: 'Size A ½' },
    { value: 39.0222, label: 'Size B' },
    { value: 39.6207, label: 'Size B ½' },
    { value: 40.2192, label: 'Size C' },
    { value: 40.8177, label: 'Size C ½' },
    { value: 41.4162, label: 'Size D' },
    { value: 42.0147, label: 'Size D ½' },
    { value: 42.6132, label: 'Size E' },
    { value: 43.2117, label: 'Size E ½' },
    { value: 43.8102, label: 'Size F' },
    { value: 44.4087, label: 'Size F ½' },
    { value: 45.0072, label: 'Size G' },
    { value: 45.6057, label: 'Size G ½' },
    { value: 46.2042, label: 'Size H' },
    { value: 46.8027, label: 'Size H ½' },
    { value: 47.4012, label: 'Size I' },
    { value: 47.9997, label: 'Size I ½' },
    { value: 48.5982, label: 'Size J' },
    { value: 49.1967, label: 'Size J ½' },
    { value: 49.7952, label: 'Size K' },
    { value: 50.3937, label: 'Size K ½' },
    { value: 50.9922, label: 'Size L' },
    { value: 51.5907, label: 'Size L ½' },
    { value: 52.1892, label: 'Size M' },
    { value: 52.7877, label: 'Size M ½' },
    { value: 53.466, label: 'Size N' },
    { value: 54.1044, label: 'Size N ½' },
    { value: 54.7428, label: 'Size O' },
    { value: 55.3812, label: 'Size O ½' },
    { value: 56.0196, label: 'Size P' },
    { value: 56.658, label: 'Size P ½' },
    { value: 57.2964, label: 'Size Q' },
    { value: 57.9348, label: 'Size Q ½' },
    { value: 58.5732, label: 'Size R' },
    { value: 59.2116, label: 'Size R ½' },
    { value: 59.85, label: 'Size S' },
    { value: 60.4884, label: 'Size S ½' },
    { value: 61.1268, label: 'Size T' },
    { value: 61.7652, label: 'Size T ½' },
    { value: 62.4026, label: 'Size U' },
    { value: 63.042, label: 'Size U ½' },
    { value: 63.6804, label: 'Size V' },
    { value: 64.3188, label: 'Size V ½' },
    { value: 64.8774, label: 'Size W' },
    { value: 65.4759, label: 'Size W ½' },
    { value: 66.0744, label: 'Size X' },
    { value: 66.6729, label: 'Size X ½' },
    { value: 67.2714, label: 'Size Y' },
    { value: 67.8699, label: 'Size Y ½' },
    { value: 68.4684, label: 'Size Z' },
    { value: 69.0669, label: 'Size Z ½' },
  ];
}
