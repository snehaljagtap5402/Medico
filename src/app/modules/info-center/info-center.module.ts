import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoCenterComponent } from './info-center.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@progress/kendo-angular-inputs';
import { SheetWeightDataComponent } from './sheet-weight-data/sheet-weight-data.component';
import { RoundWireWeightDataComponent } from './round-wire-weight-data/round-wire-weight-data.component';
import { SquareWireWeightDataComponent } from './square-wire-weight-data/square-wire-weight-data.component';
import { DShapeWireWeightDataComponent } from './d-shape-wire-weight-data/d-shape-wire-weight-data.component';
import { TubingWeightDataComponent } from './tubing-weight-data/tubing-weight-data.component';
import { SolderingMeltingTemperaturesComponent } from './soldering-melting-temperatures/soldering-melting-temperatures.component';
import { MeasurementConversionsComponent } from './measurement-conversions/measurement-conversions.component';
import { StoneSizeMeasurementsComponent } from './stone-size-measurements/stone-size-measurements.component';
import { FingerSizeMeasurementsComponent } from './finger-size-measurements/finger-size-measurements.component';
import { BullionWeightCalculatorComponent } from './bullion-weight-calculator/bullion-weight-calculator.component';
import { MeasurementWeightCalculatorComponent } from './measurement-weight-calculator/measurement-weight-calculator.component';
import { StoneSizeCalculatorComponent } from './stone-size-calculator/stone-size-calculator.component';
import { FingerSizeCalculatorComponent } from './finger-size-calculator/finger-size-calculator.component';
import { InfoComponent } from './info/info.component';
import { SheetDataComponent } from './sheet-data/sheet-data.component';
import { BullionComponent } from './bullion/bullion.component';
import { DShapeComponent } from './d-shape/d-shape.component';
import { FingerCalculatorComponent } from './finger-calculator/finger-calculator.component';
import { FingerMeasurmentComponent } from './finger-measurment/finger-measurment.component';
import { MeasurmentsComponent } from './measurments/measurments.component';
import { MeasurmentsCalculatorComponent } from './measurments-calculator/measurments-calculator.component';
import { RoundDataComponent } from './round-data/round-data.component';
import { SolderingComponent } from './soldering/soldering.component';
import { StoneCalculatorComponent } from './stone-calculator/stone-calculator.component';
import { SquareDataComponent } from './square-data/square-data.component';
import { TubingComponent } from './tubing/tubing.component';

const routes: Routes = [
  {
    path: '',
    component: InfoCenterComponent, pathMatch: 'full',
  },
  {
    path: 'sheet-data',
    component: SheetWeightDataComponent
  },
  {
    path: 'round-wire-data',
    component: RoundWireWeightDataComponent
  },
  {
    path: 'square-wire-data',
    component: SquareWireWeightDataComponent
  },
  {
    path: 'd-wire-data',
    component: DShapeWireWeightDataComponent
  },
  {
    path: 'tubing-data',
    component: TubingWeightDataComponent
  },
  {
    path: 'soldering-data',
    component: SolderingMeltingTemperaturesComponent
  },
  {
    path: 'measurement-conversions',
    component: MeasurementConversionsComponent
  },
  {
    path: 'stone-size-data',
    component: StoneSizeMeasurementsComponent
  },
  {
    path: 'finger-size-data',
    component: FingerSizeMeasurementsComponent
  },
  {
    path: 'bullion-weight-calculator',
    component: BullionWeightCalculatorComponent
  },
  {
    path: 'measurement-weight-calculator',
    component: MeasurementWeightCalculatorComponent
  },
  {
    path: 'stone-size-calculator',
    component: StoneSizeCalculatorComponent
  },
  {
    path: 'finger-size-calculator',
    component: FingerSizeCalculatorComponent
  },
  {
    path: 'd-shape-wire-weight-data',
    component: DShapeComponent
  }
]

@NgModule({
  declarations: [InfoCenterComponent, SheetWeightDataComponent, RoundWireWeightDataComponent,
    SquareWireWeightDataComponent,
    DShapeWireWeightDataComponent, TubingWeightDataComponent, SolderingMeltingTemperaturesComponent,
    MeasurementConversionsComponent, StoneSizeMeasurementsComponent, FingerSizeMeasurementsComponent,
    BullionWeightCalculatorComponent, MeasurementWeightCalculatorComponent, StoneSizeCalculatorComponent,
    FingerSizeCalculatorComponent, InfoComponent, SheetDataComponent, BullionComponent, DShapeComponent,
    FingerCalculatorComponent, FingerMeasurmentComponent, MeasurmentsComponent, MeasurmentsCalculatorComponent,
    RoundDataComponent, SolderingComponent, StoneCalculatorComponent, SquareDataComponent, TubingComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  exports: [
  ]
})
export class InfoCenterModule { }
